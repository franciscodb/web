import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { supabase } from '@/src/lib/supabase';
import {
  namehash,
  labelhash,
  generateSubdomain,
  isValidSubdomain,
  getFullDomain,
  ENS_CONTRACTS,
  ENS_REGISTRY_ABI,
  PUBLIC_RESOLVER_ABI,
  ENSRegistrationResult,
} from '@/src/lib/ens-utils';

/**
 * API Route: POST /api/ens/register
 * 
 * Registra un subdominio de brightlend.eth para un usuario
 * 
 * Body: {
 *   userId: string,
 *   walletAddress: string,
 *   customSubdomain?: string (opcional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, walletAddress, customSubdomain } = body;

    // Validaciones
    if (!userId || !walletAddress) {
      return NextResponse.json(
        { success: false, error: 'userId y walletAddress son requeridos' },
        { status: 400 }
      );
    }

    if (!ethers.isAddress(walletAddress)) {
      return NextResponse.json(
        { success: false, error: 'Dirección de wallet inválida' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe en Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el usuario ya tiene un ENS asignado
    if (user.ens_subdomain) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario ya tiene un ENS asignado',
          subdomain: user.ens_subdomain,
          fullDomain: getFullDomain(user.ens_subdomain),
        },
        { status: 400 }
      );
    }

    // Generar o validar subdominio
    let subdomain = customSubdomain || generateSubdomain(walletAddress);
    
    if (!isValidSubdomain(subdomain)) {
      return NextResponse.json(
        { success: false, error: 'Subdominio inválido. Solo letras minúsculas, números y guiones.' },
        { status: 400 }
      );
    }

    // Verificar que el subdominio no esté tomado
    const { data: existingENS } = await supabase
      .from('users')
      .select('id')
      .eq('ens_subdomain', subdomain)
      .single();

    if (existingENS) {
      // Generar uno aleatorio si está tomado
      subdomain = generateSubdomain(walletAddress) + Math.random().toString(36).substring(2, 5);
    }

    // Configurar provider y wallet
    const provider = new ethers.JsonRpcProvider(
      process.env.ARBITRUM_SEPOLIA_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc'
    );

    const privateKey = process.env.ENS_OWNER_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('ENS_OWNER_PRIVATE_KEY no configurada');
    }

    const wallet = new ethers.Wallet(privateKey, provider);

    // Conectar con contratos ENS
    const registry = new ethers.Contract(
      ENS_CONTRACTS.REGISTRY,
      ENS_REGISTRY_ABI,
      wallet
    );

    const resolver = new ethers.Contract(
      ENS_CONTRACTS.PUBLIC_RESOLVER,
      PUBLIC_RESOLVER_ABI,
      wallet
    );

    // Calcular hashes
    const baseDomain = 'brightlend.eth';
    const baseNode = namehash(baseDomain);
    const label = labelhash(subdomain);
    const subdomainNode = namehash(getFullDomain(subdomain));

    console.log('Registrando subdominio:', {
      subdomain,
      fullDomain: getFullDomain(subdomain),
      walletAddress,
      baseNode,
      subdomainNode,
    });

    // Paso 1: Registrar el subdominio (setSubnodeOwner)
    console.log('Paso 1: Registrando subdominio en ENS Registry...');
    const tx1 = await registry.setSubnodeOwner(
      baseNode,
      label,
      wallet.address // Primero lo asignamos al owner temporalmente
    );
    await tx1.wait();
    console.log('✅ Subdominio registrado. TX:', tx1.hash);

    // Paso 2: Configurar el resolver
    console.log('Paso 2: Configurando resolver...');
    const tx2 = await registry.setResolver(
      subdomainNode,
      ENS_CONTRACTS.PUBLIC_RESOLVER
    );
    await tx2.wait();
    console.log('✅ Resolver configurado. TX:', tx2.hash);

    // Paso 3: Configurar la dirección en el resolver
    console.log('Paso 3: Configurando dirección en resolver...');
    const tx3 = await resolver.setAddr(subdomainNode, walletAddress);
    await tx3.wait();
    console.log('✅ Dirección configurada. TX:', tx3.hash);

    // Paso 4: Transferir ownership al usuario (opcional, por ahora lo dejamos en el owner)
    // const tx4 = await registry.setSubnodeOwner(baseNode, label, walletAddress);
    // await tx4.wait();

    // Guardar en Supabase
    const { error: updateError } = await supabase
      .from('users')
      .update({
        ens_subdomain: subdomain,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error actualizando Supabase:', updateError);
      // No fallar si Supabase falla, el ENS ya está registrado
    }

    const result: ENSRegistrationResult = {
      success: true,
      subdomain,
      fullDomain: getFullDomain(subdomain),
      txHash: tx3.hash,
    };

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error registrando ENS:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error desconocido al registrar ENS',
      },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/ens/register?domain=user123.brightlend.eth
 * 
 * Verifica si un subdominio está disponible
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json(
        { available: false, error: 'Subdominio requerido' },
        { status: 400 }
      );
    }

    if (!isValidSubdomain(subdomain)) {
      return NextResponse.json(
        { available: false, error: 'Subdominio inválido' },
        { status: 400 }
      );
    }

    // Verificar en Supabase
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('ens_subdomain', subdomain)
      .single();

    return NextResponse.json({
      available: !data,
      subdomain,
      fullDomain: getFullDomain(subdomain),
    });

  } catch (error: any) {
    return NextResponse.json(
      { available: false, error: error.message },
      { status: 500 }
    );
  }
}
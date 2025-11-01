import { ethers } from 'ethers';

// Direcciones de contratos ENS en Sepolia
export const ENS_CONTRACTS = {
  REGISTRY: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  PUBLIC_RESOLVER: '0x8FADE66B79cC9f707aB26799354482EB93a5B7dD',
  REGISTRAR_CONTROLLER: '0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72',
} as const;

// ABI mínimo de ENS Registry
export const ENS_REGISTRY_ABI = [
  'function setSubnodeOwner(bytes32 node, bytes32 label, address owner) external returns (bytes32)',
  'function setResolver(bytes32 node, address resolver) external',
  'function owner(bytes32 node) external view returns (address)',
  'function resolver(bytes32 node) external view returns (address)',
];

// ABI mínimo de Public Resolver
export const PUBLIC_RESOLVER_ABI = [
  'function setAddr(bytes32 node, address addr) external',
  'function addr(bytes32 node) external view returns (address)',
  'function setText(bytes32 node, string key, string value) external',
  'function text(bytes32 node, string key) external view returns (string)',
];

/**
 * Calcula el namehash de un dominio ENS
 * Ejemplo: namehash('brightlend.eth')
 */
export function namehash(name: string): string {
  let node = '0x0000000000000000000000000000000000000000000000000000000000000000';
  
  if (name) {
    const labels = name.split('.');
    for (let i = labels.length - 1; i >= 0; i--) {
      const labelHash = ethers.keccak256(ethers.toUtf8Bytes(labels[i]));
      node = ethers.keccak256(ethers.concat([node, labelHash]));
    }
  }
  
  return node;
}

/**
 * Calcula el labelhash de una etiqueta
 * Ejemplo: labelhash('usuario1')
 */
export function labelhash(label: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(label));
}

/**
 * Genera un subdominio único basado en la wallet
 * Ejemplo: 0x1234...5678 → bright1234
 */
export function generateSubdomain(walletAddress: string): string {
  // Tomar los primeros 8 caracteres después de 0x
  const shortAddress = walletAddress.slice(2, 10).toLowerCase();
  return `user${shortAddress}`;
}

/**
 * Genera un subdominio aleatorio
 */
export function generateRandomSubdomain(): string {
  const random = Math.random().toString(36).substring(2, 10);
  return `user${random}`;
}

/**
 * Valida que un subdominio sea válido para ENS
 */
export function isValidSubdomain(subdomain: string): boolean {
  // Solo letras minúsculas, números y guiones
  // No puede empezar ni terminar con guión
  const regex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  return regex.test(subdomain) && subdomain.length >= 3 && subdomain.length <= 32;
}

/**
 * Obtiene el dominio completo
 */
export function getFullDomain(subdomain: string, baseDomain: string = 'brightlend.eth'): string {
  return `${subdomain}.${baseDomain}`;
}

/**
 * Tipos para las respuestas
 */
export interface ENSRegistrationResult {
  success: boolean;
  subdomain?: string;
  fullDomain?: string;
  txHash?: string;
  error?: string;
}

export interface ENSResolveResult {
  address: string | null;
  error?: string;
}
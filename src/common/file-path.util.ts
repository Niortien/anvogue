// Multer renvoie file.path avec le séparateur natif de l'OS. Sur Windows, ça produit des
// backslashes qui ne sont pas des séparateurs de chemin valides une fois exposés en URL.
export function toWebPath(path?: string): string | undefined {
    return path?.replace(/\\/g, '/');
}

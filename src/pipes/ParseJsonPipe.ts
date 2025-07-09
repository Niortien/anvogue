import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  constructor(private readonly keys: string[]) {}

  transform(value: any, metadata: ArgumentMetadata) {
    console.log('🟦 [ParseJsonPipe] → Type de transformation :', metadata.type);
    console.log('🔹 [Avant parsing] Données reçues :', JSON.stringify(value, null, 2));

    if (!value) {
      console.log('⚠️ [ParseJsonPipe] → Valeur vide ou nulle, retour inchangé');
      return value;
    }

    this.keys.forEach((key) => {
      const rawValue = value[key];
      if (rawValue && typeof rawValue === 'string') {
        console.log(`📦 [ParseJsonPipe] → Tentative de parsing pour la clé "${key}" avec la valeur :`, rawValue);

        try {
          const parsed = JSON.parse(rawValue);
          console.log(`✅ [ParseJsonPipe] → Valeur parsée pour "${key}" :`, JSON.stringify(parsed, null, 2));

          if (!Array.isArray(parsed)) {
            console.warn(`⚠️ [ParseJsonPipe] → "${key}" n'est pas un tableau, mais :`, typeof parsed);
          }

          value[key] = parsed;
        } catch (e) {
          console.error(`❌ [ParseJsonPipe] → Erreur de parsing pour la clé "${key}" :`, e);
          throw new BadRequestException(`Le champ '${key}' doit être un JSON valide`);
        }
      } else {
        console.log(`ℹ️ [ParseJsonPipe] → Clé "${key}" ignorée (valeur absente ou déjà typée)`);
      }
    });

    console.log('✅ [Après parsing] Résultat final :', JSON.stringify(value, null, 2));
    return value;
  }
}

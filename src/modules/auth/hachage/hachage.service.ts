import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HachageService {
  async hachPassword(password: string) {
    const salt = await bcrypt.genSalt(); // genereation du sel ou le code que l'on prend prend pour crypter
    const hach = await bcrypt.hash(password, salt); //le hashage maintenant

    return hach;
  }
// fonction permettant de comparer le mot de passe haché de l'utlisateur avec celui enregistré dans la bd
  async comparePassword(password: string, hach: string) {
    return await bcrypt.compare(password, hach);
  }
}

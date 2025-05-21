import { Injectable } from "@nestjs/common";
import { hotp } from "otplib";
import { ConfigService } from '@nestjs/config';
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class OtpService {
  private readonly secret: string;

  constructor(private readonly configService: ConfigService, private readonly prisma: PrismaService) {

    this.secret = this.configService.get<string>("OTP_SECRET") ?? "";
    hotp.options = { digits: 6 };
  }

  async generate(email: string) {

    // Récupérer le OTP s'il n'a pas encore expiré
    const otpToken = await this.prisma.otp.findFirst({
      where: {
        email,
        expire: {
          gte: new Date(),
        },
      },
    });

    if (otpToken) {
      return otpToken.code;
    }

    // Si Non trouvé, on génère un nouveau OTP
    let counter = 0;
    const counterOtp = await this.prisma.counterOtp.findFirst();


    // Création ou mise à jour du counter
    if (counterOtp) {
      counter = counterOtp.counter + 1;

      await this.prisma.counterOtp.update({
        where: { id: counterOtp.id },
        data: { counter },
      });
    } else {
      await this.prisma.counterOtp.create({ data: { counter } });
    }


    // GENERATE OTP TOKEN
    const otp = hotp.generate(this.secret, counter);


    // CREATE OTP TOKEN
    await this.prisma.otp.create({
      data: {
        code: otp,
        email,
        counter,
        expire: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return otp;
  }

  async verify(token: string) {
    const counterOtp = await this.prisma.counterOtp.findFirst();
    const counter = counterOtp?.counter ?? 0;
    return hotp.verify({ token, counter, secret: this.secret });
  }
}

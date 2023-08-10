import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly userService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL:
        'http://ec2-52-79-78-130.ap-northeast-2.compute.amazonaws.com/auth/google/callback',
      scope: ['email'],
    });
  }

  async validate(
    accessToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const email = emails[0].value;

    // 이메일을 기준으로 데이터베이스에서 사용자 찾기
    const user = await this.userService.findUserByUserId(email);

    if (user) {
      // 사용자가 이미 등록되어 있는 경우
      // 여기에서 추가적인 인증 로직을 수행할 수 있습니다.
      // 예를 들어, 사용자 정보를 세션에 저장하거나 JWT 토큰을 생성하여 반환할 수 있습니다.
      // 이후 done 메서드를 사용하여 사용자 정보를 반환합니다.
      done(null, user);
    } else {
      // 사용자가 처음 로그인하는 경우
      // 여기에서 새로운 사용자로 등록하는 로직을 수행합니다.
      // 예를 들어, 사용자 정보를 데이터베이스에 저장하고 세션에 저장하거나 JWT 토큰을 생성하여 반환할 수 있습니다.
      // 이후 done 메서드를 사용하여 사용자 정보를 반환합니다.
      const newUser = await this.userService.createUser({
        userId: email,
        nickName: name,
        password: 'password123', // 예시로 비밀번호를 추가해줌
        status: 'active', // 예시로 status를 추가해줌
        // 추가적인 사용자 정보를 등록할 수 있습니다.
      });

      done(null, newUser);
    }
  }
}
// async validate(accessToken, refreshToken, profile) {
//   //console.log(toekn etc..)

//   return {
//     name: profile.displayName,
//     email: profile.emails[0].value,
//     hashedPassword: '1234',
//   };
// }

// async validate(
//   accessToken: string,
//   profile: any,
//   done: VerifyCallback,
// ): Promise<any> {
//   const { name, emails, photos } = profile;
//   const user = {
//     profile,
//     accessToken,
//   };
//   done(null, user);
// }

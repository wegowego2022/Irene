// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-kakao';
// import { UserService } from 'src/users/users.service';

// @Injectable()
// export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
//   constructor(private readonly userService: UserService) {
//     super({
//       clientID: process.env.KAKAO_CLIENT_ID,
//       callbackURL: process.env.KAKAO_CALLBACK_URL,
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: any,
//   ) {
//     const { id, properties, kakao_account } = profile._json;
//     const user = {
//       userId: id,
//       nickName: properties.nickname,
//       profileImage: properties.profile_image,
//       email: kakao_account.email,
//       password: Math.random().toString(36).substring(2),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       Status: 'Active',

//       // 카카오 로그인으로 사용자를 생성할 때는 비밀번호가 필요하지 않으므로, 랜덤한 문자열을 생성하여 사용
//       // 이후에 카카오 로그인 사용자가 다른 방식으로 로그인하려 할 때 문제를 방지하기 위함
//     };

//     const existingUser = await this.userService.findUserByUserId(user.userId);

//     // 사용자가 이미 있는 경우
//     if (existingUser) {
//       return done(null, existingUser);
//     }

//     // 사용자가 없는 경우, 새로운 사용자를 생
//     const newUser = await this.userService.createUser(user);
//     return done(null, newUser);
//   }
// }

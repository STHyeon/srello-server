// let jweObj = {};
// module.exports = jweObj;

import jwt from "jsonwebtoken";

const APP_SECRET = "GRAPHQL";

function getUserID(context) {
    const Authorization = context.request.get("Authorization");

    if (Authorization) {
        const token = Authorization.replace("Bearer ", "");
        const { userID } = jwt.verify(token, APP_SECRET);
        return userID;
    }

    throw new Error("Not Authenticated");
}

module.exports = {
    APP_SECRET,
    getUserID,
};

// // token 발행
// function jwtUser(context) {
//     const token = jwt.sign({ username: context }, jweObj, { expiresIn: "5m" });
//     return token;
// }

// // token 디코드
// function unJwtUser(context) {
//     console.log(context);
//     jwt.verify(context, jweObj, (err, result) => {
//         if (err) {
//             console.log("함수 에러");
//             console.log(result);
//             return err;
//         }
//         return result;
//     });
// }

// module.exports = { jwtUser, unJwtUser };

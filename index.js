import { ApolloServer, PubSub } from "apollo-server";

import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/typeDefs";

import mongoose from "mongoose";

// const mongo_url = "mongodb://localhost/trello"; // local
const mongo_url = "mongodb+srv://admin:1234@cluster0.d1rsj.mongodb.net/trello?retryWrites=true&w=majority"; // mongodb cloud

//usCreateIndex, useNewUrlParser 는 오류 방지용
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise; // 비동기 처리
mongoose
    .connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then()
    .catch((e) => console.log(e));

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: { pubsub },
});

// 경로 지정할 때
// https://www.apollographql.com/docs/apollo-server/migration-two-dot/#simplified-usage
const port = process.env.PORT || 5000;
// server.listen(port, () => {
//     console.log("server on");
// });

server.listen(port).then(({ url }) => {
    console.log(`Listening at ${url}`);
});

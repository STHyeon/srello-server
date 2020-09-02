const { ApolloServer, PubSub } = require("apollo-server");

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");

const mongoose = require("mongoose");

// const mongo_url = "mongodb://localhost/trello"; // local
const mongo_url = "mongodb+srv://admin:1234@srello.d1rsj.mongodb.net/Srello?retryWrites=true&w=majority"; // mongodb cloud

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
const port = process.env.PORT || 4000;
// server.listen(port, () => {
//     console.log("server on");
// });

server.listen(port).then(({ url }) => {
    console.log(`Listening at ${url}`);
});

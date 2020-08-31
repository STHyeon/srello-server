const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { APP_SECRET, getUserID } = require("../utils/jwt");

const Board = require("../models/board");
const User = require("../models/user");
const { db } = require("../models/board");

const BOARD_UPDATE = "BOARD_UPDATE";
const LIST_UPDATE = "LIST_UPDATE";

const resolvers = {
    Query: {
        // 글쓰기 관련
        allBoard: async () => {
            return await Board.find();
        },

        getBoard: async (_, { _id }) => {
            const result = await Board.find({ $and: [{ _id: _id }] });

            return result;
        },

        getUserBoard: async (_, { _id }) => {
            const result = await Board.find({ $and: [{ author: _id }] });

            return result;
        },

        // 회원 관련
        allUser: async () => {
            return await User.find();
        },
    },

    Mutation: {
        // 글쓰기 관련
        createBoard: async (_, { title, author }, { pubsub }) => {
            const published_date = new Date().toString().substr(0, 21);
            const boardBox = { title: title, author: author, published_date: published_date };
            const result = await Board.create(boardBox);

            pubsub.publish(BOARD_UPDATE, {
                newBoard: result,
            });

            return result;
        },

        createLists: async (_, { id, listTitle, author }, { pubsub }) => {
            const published_date = new Date().toString().substr(0, 21);
            const subListTitle = { listTitle: listTitle, author: author, published_date: published_date };
            const result = await Board.findByIdAndUpdate({ _id: id }, { $push: { list: subListTitle } }, { new: true });

            pubsub.publish(LIST_UPDATE, {
                newLists: result,
            });

            return result;
        },

        createComments: async (_, { boardID, listID, content, author }, { pubsub }) => {
            // https://stackoverflow.com/questions/23577123/updating-a-nested-array-with-mongodb
            // nested array 참고 사이트
            const published_date = new Date().toString().substr(0, 21);
            const subComment = { content: content, author: author, published_date: published_date };
            const result = await Board.findOneAndUpdate({ _id: boardID, "list._id": listID }, { $push: { "list.$.taskIds": subComment } }, { new: true });

            pubsub.publish(LIST_UPDATE, {
                newLists: result,
            });

            return result;
        },

        dropBoard: async (_, { boardID }, { pubsub }) => {
            await Board.findByIdAndRemove({ _id: boardID }, { new: true });
            const result = await Board.find();

            pubsub.publish(BOARD_UPDATE, {
                newBoard: result,
            });

            return "SUCCESS";
        },

        dropList: async (_, { boardID, listID }, { pubsub }) => {
            var dropID = { _id: listID };
            const result = await Board.findOneAndUpdate({ _id: boardID }, { $pull: { list: dropID } }, { new: true });

            pubsub.publish(LIST_UPDATE, {
                newLists: result,
            });

            return "SUCCESS";
        },

        dropComment: async (_, { boardID, listID, commentID }, { pubsub }) => {
            var dropID = { _id: commentID };
            const result = await Board.findOneAndUpdate({ _id: boardID, "list._id": listID }, { $pull: { "list.$.taskIds": dropID } }, { new: true });

            pubsub.publish(LIST_UPDATE, {
                newLists: result,
            });

            return "SUCCESS";
        },

        changePosition: async (_, { boardID, ListAll }) => {
            await Board.findByIdAndUpdate({ _id: boardID }, ListAll, { new: true });

            return "SUCCESS";
        },

        modifyList: async (_, { boardID, listID, listTitle }, { pubsub }) => {
            const result = await Board.findOneAndUpdate({ _id: boardID, "list._id": listID }, { "list.$.listTitle": listTitle }, { new: true });

            pubsub.publish(LIST_UPDATE, {
                newLists: result,
            });

            return "SUCCESS";
        },

        modifyComment: async (_, { boardID, listID, commentID, content }, { pubsub }) => {
            const result = await Board.findOneAndUpdate({ _id: boardID }, { "list.$[i].taskIds.$[j].content": content }, { arrayFilters: [{ "i._id": listID }, { "j._id": commentID }] });

            pubsub.publish(LIST_UPDATE, {
                newLists: result,
            });

            return "SUCCESS";
        },

        // 회원관련
        signup: async (_, { userID, userName, userPW }) => {
            const password = await bcrypt.hash(userPW, 10);
            const userFind = await User.find({ userID: userID });

            if (userFind.length > 0) {
                throw new Error("이미 존재하는 아이디입니다.");
            }

            const published_date = new Date().toString().substr(0, 21);
            const user = await User.create({ userID, userName, userPW: password, published_date: published_date });
            const token = jwt.sign({ userID: userID }, APP_SECRET); //jwt.sign({토근의 내용}, 비밀키)

            return { token, user };
        },

        login: async (_, { userID, userPW }) => {
            const user = await User.find({ $and: [{ userID: userID }] });

            if (user.length == 0) {
                throw new Error("유저를 찾을 수 없습니다.");
            }

            const userData = user[0];
            const valid = await bcrypt.compare(userPW, userData.userPW);

            if (!valid) {
                throw new Error("비밀번호가 일치하지 않습니다.");
            }

            const token = jwt.sign({ userID: userID }, APP_SECRET);

            return { token, user: userData };
        },
    },

    Subscription: {
        newBoard: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(BOARD_UPDATE),
        },
        newLists: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(LIST_UPDATE),
        },
    },
};

module.exports = resolvers;

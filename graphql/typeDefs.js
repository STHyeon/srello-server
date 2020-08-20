const { gql } = require("apollo-server");

// 느낌표(!) = null값이 아닌 값을 반환할 것을 기대함
// null 발생 시 오류

const typeDefs = gql`
    # 글쓰기 관련
    type comments {
        _id: ID
        content: String
        author: String
        published_date: Date
    }

    type lists {
        _id: ID
        listTitle: String
        author: String
        published_date: Date
        taskIds: [comments]
    }

    type board {
        _id: ID
        title: String
        author: String
        published_date: Date
        list: [lists]
    }

    # 회원 관련
    type user {
        _id: ID
        userID: String
        userName: String
        userPW: String
    }

    type authPayload {
        token: String
        user: user
    }

    scalar Date # DATE 타입 정의
    # 글쓰기 입력 관련
    input inputComments {
        _id: ID
        content: String
        author: String
        published_date: Date
    }

    input inputList {
        _id: ID
        listTitle: String
        author: String
        published_date: Date
        taskIds: [inputComments]
    }

    input inputListAll {
        list: [inputList]
    }

    # 쿼리 정의
    type Query {
        # 글쓰기 관련
        allBoard: [board]
        getBoard(_id: ID!): [board]
        getUserBoard(_id: ID!): [board]

        # 회원 관련
        allUser: [user]
    }

    # 뮤테이션 정의
    type Mutation {
        # 글쓰기 관련
        createBoard(title: String, author: String): board
        createLists(id: String, listTitle: String, author: String): lists
        createComments(boardID: String, listID: String, content: String, author: String): board
        dropBoard(boardID: String): String
        dropList(boardID: String, listID: String): String
        dropComment(boardID: String, listID: String, commentID: String): String
        changePosition(boardID: String, ListAll: inputListAll): String

        # 회원 관련
        signup(userID: String, userName: String, userPW: String): authPayload
        login(userID: String, userPW: String): authPayload
    }

    # 섭스크립션 정의
    type Subscription {
        newBoard: board
        newLists: board
    }
`;

module.exports = typeDefs;

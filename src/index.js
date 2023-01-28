import fetch from 'node-fetch';
import { ApolloServer,gql } from 'apollo-server';

const typeDefs = gql`
  type Book {
    id: String  
    title: String
    author: String
  }
  type Breakingquote {
    quote: String
    author: String
    id: String
  }

  type Query {
    Getbooks: [Book],
    Getbook(id:String!):Book
    Getquotes: [Breakingquote]
    Getquote(id:String!): Breakingquote
  }
  type Mutation {
      CreateBook(id: String!,title: String!, author: String!): Book
      DeleteBook(id: String!): Book
      UpdateBook(id: String!,title: String!, author: String!): Book 
      CreateQuote(id: String!,quote: String!, author: String!): Breakingquote
      DeleteQuote(id: String!): Breakingquote
      UpdateQuote(id: String!,quote: String!, author: String!): Breakingquote 
  }
`;

let books = [
  {
    id: "1",
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    id: "2",
    title: 'City of Glass',
    author: 'Paul Auster',
  },
  {
    id: "3",
    title: 'Del amor y otros demonios',
    author: 'Gabriel garcia Marquez',
  }
];
let breakingquotes
fetch("https://api.breakingbadquotes.xyz/v1/quotes/10")
  .then(res => res.json())
  .then(data => {
    breakingquotes = data;
  })
  .then(() => {
    for (let i = 0; i < breakingquotes.length; i++) {
      breakingquotes[i].id = i + 1
    }
  });

const resolvers = {
  Mutation: {
    CreateBook: (_, arg) => { books.push(arg); return arg },
    DeleteBook: (_, arg) => {
      let finalbooks = books.filter(book => book.id != arg.id);
      let bookdeleted = books.find(book => book.id == arg.id);
      books = [...finalbooks];
      return bookdeleted
    },
    UpdateBook: (_, arg) => {
      let objIdx = books.findIndex(book => book.id == arg.id);
      books[objIdx] = arg
      return arg

    },
    CreateQuote: (_, arg) => { breakingquotes.push(arg); return arg },
    DeleteQuote: (_, arg) => {
      let finalquotes = breakingquotes.filter(quote => quote.id != arg.id);
      let quotedeleted = breakingquotes.find(quote => quote.id == arg.id);
      breakingquotes = [...finalquotes];
      return quotedeleted
    },
    UpdateQuote: (_, arg) => {
      let objIdx = breakingquotes.findIndex(quote => quote.id == arg.id);
      breakingquotes[objIdx] = arg
      return arg

    },

  },
  Query: {
    Getbooks: () => books,
    Getbook: (_, arg) => books.find(number => number.id == arg.id),
    Getquotes: () => breakingquotes,
    Getquote: (_, arg) => breakingquotes.find(number => number.id == arg.id)
  },
};


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
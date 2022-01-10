require('dotenv').config()
const { Client } = require('pg')
const { ApolloServer, gql } = require("apollo-server");


const client = new Client({
    connectionString : process.env.PGSTRING,
    ssl: { rejectUnauthorized: false }
  })
client.connect();  


const typeDefs = gql`
  type Book {
    id: String  
    title: String
    author: String
  }

  type Query {
    Getbooks: [Book],
    Getbook(id:String!):[Book]
  }
  type Mutation {
      CreateBook(id: String!,title: String!, author: String!): Book
      DeleteBook(id: String!): Book
      UpdateBook(id: String!,title: String!, author: String!): Book 
  }
`;

let books = [
    {
      id:"1",
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      id:"2",  
      title: 'City of Glass',
      author: 'Paul Auster',
    },
    {
       id:"3",  
       title: 'Del amor y otros demonios',
       author: 'Gabriel garcia Marquez',
    }
  ];
  const resolvers = {
    Mutation: {
        CreateBook: (_,arg) => {books.push(arg); return arg},
        DeleteBook: (_,arg) => { 
                                 let finalbooks=books.filter(book => book.id != arg.id);
                                 let bookdeleted = books.find(book => book.id == arg.id );   
                                 books = [...finalbooks]; 
                                 return bookdeleted
                                },
        UpdateBook:(_,arg) => {  let objIdx = books.findIndex(book => book.id == arg.id);
                                 books[objIdx] = arg
                                 return arg   
             
                              }                        

    },  
    Query: {
      Getbooks: async () => { 
                               try{
                                let resp = await client.query('select * from books')
                                return resp.rows

                                }catch(e){
                                    console.log(e)
                                }
                               
                             },

      Getbook: async (_,arg) => { 
                                  try{
                                    let resp = await client.query(`select * from books where id = '${arg.id}'`)
                                    return resp.rows
                  

                                  }catch(e){
                                   console.log(e)
                                  }  
                                 
                                }
    },
  };


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
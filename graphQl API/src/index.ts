import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import fs from "fs";
import path from "path";

const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Query {
    users: [User]
  }

  type Mutation {
    addUser(name: String!, email: String!, role: String!): User
    updateUser(id: ID!, name: String, email: String, role: String): User
    deleteUser(id: ID!): Boolean
  }
`;

const filePath = path.join(__dirname, "users.json");
console.log("Looking for users.json at:", filePath);

const readUsers = () => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const writeUsers = (data: any) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

const resolvers = {
  Query: {
    users: () => readUsers(),
  },
  Mutation: {
    addUser: (_: any, { name, email, role }: any) => {
      const users = readUsers();

      const lastId =
        users.length > 0
          ? Math.max(...users.map((u: any) => parseInt(u.id)))
          : 0;
      const newUser = { id: (lastId + 1).toString(), name, email, role };

      users.push(newUser);
      writeUsers(users);
      return newUser;
    },
    updateUser: (_: any, { id, name, email, role }: any) => {
      const users = readUsers();
      const user = users.find((u: any) => u.id === id);
      if (!user) return null;
      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
      writeUsers(users);
      return user;
    },
    deleteUser: (_: any, { id }: any) => {
      let users = readUsers();
      const initialLength = users.length;
      users = users.filter((u: any) => u.id !== id);
      writeUsers(users);
      return users.length < initialLength;
    },
  },
};

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer();

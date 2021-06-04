
// import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// const client = new ApolloClient({
//   uri: "https://api.thegraph.com/subgraphs/name/kleros/proof-of-humanity-mainnet",
//   cache: new InMemoryCache(),
// });

// interface IEvidence {
//   URI: string,
//   id: string
// }

// interface IRequest {
//   evidence: IEvidence[]
// }

// interface ISubmission {
//   id: string,
//   name: string,
//   requests: IRequest[]
// }

// const getSubmissionRegistration: { [key: string]: ISubmission } = {};

// const cache = {
//   getSubmissionRegistration: getSubmissionRegistration
// }

const PohOnChainDAL = {
//   async getSubmissionRegistration(address: string): Promise<ISubmission> {
//     if (cache.getSubmissionRegistration[address])
//       return cache.getSubmissionRegistration[address];


//     const result = await client.query<ISubmission>({
//       query: gql`
//               query voucherQuery($id: ID!) {
//                 submission(id: $id) {
//                   id
//                   name
//                   requests(
//                     orderBy: creationTime
//                     orderDirection: desc
//                     first: 1
//                     where: { registration: true }
//                   ) {
//                     evidence(orderBy: creationTime, first: 1) {
//                       URI
//                       id
//                     }
//                     id
//                   }
//                 }
//               }
//             `,
//       variables: { id: address.toLowerCase(), vouchesReceivedLength: 100 },
//     });

//     cache.getSubmissionRegistration[address] = result.data;

//     console.log("IResult", result);

//     return result.data;
//   }
}

export default PohOnChainDAL;
import similarityTool from "./similarityTool";
import storeConversationTool from "./storeConversationTool";

const tools = [
  similarityTool,
  storeConversationTool,
];

export const toolsByName: { [key: string]: any } = {
  SimilaritySearch: similarityTool,
  StoreConversation: storeConversationTool,
};

export default tools;

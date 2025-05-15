
import { Link } from "react-router-dom";
import { DiscussionTopicItem } from "../DiscussionTopicItem";
import { KnowledgeEntryItem } from "../KnowledgeEntryItem";

export const CommunityActivity = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[#1A1A1A] p-6 rounded-lg hover-lift">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Discussions</h3>
        <div className="space-y-4">
          <DiscussionTopicItem
            title="The intersection of quantum physics and consciousness"
            author="PhilosophicalMind"
            replies={24}
            timeAgo="2h ago"
          />
          <DiscussionTopicItem
            title="Mathematical patterns in natural phenomena"
            author="MathExplorer"
            replies={18}
            timeAgo="5h ago"
          />
          <DiscussionTopicItem
            title="Ethical implications of AI advancement"
            author="EthicsScholar"
            replies={32}
            timeAgo="8h ago"
          />
        </div>
        <Link to="/forum" className="inline-block mt-4 text-blue-400 text-sm hover:underline">View all discussions</Link>
      </div>
      
      <div className="bg-[#1A1A1A] p-6 rounded-lg hover-lift">
        <h3 className="text-xl font-semibold text-white mb-4">New Knowledge Entries</h3>
        <div className="space-y-4">
          <KnowledgeEntryItem
            title="Introduction to Systems Thinking"
            author="ComplexityScholar"
            readTime="15 min read"
            timeAgo="2d ago"
          />
          <KnowledgeEntryItem
            title="The Mathematics of Music: Harmony and Frequency"
            author="HarmonicsExpert"
            readTime="12 min read"
            timeAgo="1w ago"
          />
          <KnowledgeEntryItem
            title="Neural Networks: From Biology to Computation"
            author="BioComputation"
            readTime="20 min read"
            timeAgo="3d ago"
          />
        </div>
        <Link to="/library" className="inline-block mt-4 text-blue-400 text-sm hover:underline">View all entries</Link>
      </div>
    </div>
  );
};

import ConversationTile from "@/components/custom/conversation-tile";
// import SignOutBtn from "@/components/custom/sign-out";
import UserData from "@/components/custom/user-data";

export default async function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <h1 className="text-center text-xl font-semibold text-black md:text-3xl">
        See all the active anonymous conversations here.
      </h1>
      <div className="flex w-[90%] flex-col md:flex">
        <UserData />
        <div className="flex flex-col">
          <ConversationTile />
        </div>
      </div>
    </div>
  );
}

// write code so that we can fetch all the conversationId where the current user is a sender or receiver.

// all the fetched convo tiles will redirect the user to /dashboard/conversation/[conversationID] by Link component.

//there we will fetch all the rows of message table which are associated with that conversationId, depending on the user session we will arrange message content on left-0 or right-o, for sender and receiver Ui feel

//Message table : Id, authorId, messagecontent, createdAt, conversationId
//conversation table: id, senderId, receiverId, createdAt, updatedAt

//this page also contains a form which generates a new message table row on form submission,

// is AcceptingMessage toggle will be on user-dashboard, which will be user table.

//API -
// fetching all conversationId for current session in dashboard page,
// fetchin all messages sharing one conversationID and aligning them in whatsApp way

// filtering conversations based on whether they are initiated by him or not.

// POST Toggle Accepting messages status
// GET Fetch Accepting Messages status

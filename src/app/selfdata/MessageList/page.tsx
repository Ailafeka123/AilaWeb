
import MessageListComponent from "./MessageListComponent"
import Style from "@/style/selfData/messageList/messageList.module.scss";
export default function MessageList(){

    return (
        <main className={Style.main}>
            <MessageListComponent/>
        </main>
    )
}
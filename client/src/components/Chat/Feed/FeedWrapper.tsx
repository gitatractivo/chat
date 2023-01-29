import { Session } from "next-auth"

interface Props  {
  session: Session
}

const FeedWrapper = ({session}: Props) => {
  return (
    <div>FeedWrapper</div>
  )
}

export default FeedWrapper
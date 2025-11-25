import Ping from "./Ping";
import { sanityFetch } from "@/sanity/lib/live";
import { STARTUP_VIEWS_BY_ID_QUERY } from "@/sanity/lib/queries";
import ViewClient from "./ViewClient";

const View = async ({ id }: { id: string }) => {
  const {data} = await sanityFetch({query: STARTUP_VIEWS_BY_ID_QUERY, params: {id}});

  let views = 0;
  if(data && data.views != null ) views = data.views; 

  if(views === null) return null;
  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black">
          {`${views} view${views <= 1 ? "" : "s"}`}
        </span>
      </p>
      <ViewClient id={id}/>
    </div>
  );
};

export default View;







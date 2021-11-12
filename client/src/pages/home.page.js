import React from "react";
import { observer } from "mobx-react";
import { Buyer } from "../components/statistics/my.statistic";
import { useStores } from "../stores";
import { TabStores } from "../components/statistics/stores.statistic";
export const HomePage = observer(() => {
  const { userStore } = useStores();
  return (
    <div className="Base-Page">
      {userStore.role == 4 ? <TabStores key="tab" /> : <Buyer />}
    </div>
  );
});

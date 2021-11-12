import "./App.css";
import { MyLayout } from "./layouts";
import { Login } from "./auth/login";
import { observer } from "mobx-react";
import { useStores } from "./stores";
const App = observer(() => {
  const { userStore } = useStores();
  return (
    <div className="App">
      {userStore.accessToken != null ? <MyLayout/> : <Login />}
    </div>
  );
});

export default App;

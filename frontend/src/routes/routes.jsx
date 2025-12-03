import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import App from "../App";
import Home from "../page/Home";

const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App/>}>
            <Route index element={<Home/>}/>
        </Route>
    )
)

export default routes;


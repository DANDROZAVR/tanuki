import React from "react";
import NodeEditor from "./node_editor";
import TextEditor from "./text_editor";
import ThemeSelector from "./theme_selector";
import { renderOptions } from "renderer/render_options";
import { Script } from "renderer/script";

function MainWindow() {
  return (<>
  <div className="vertSplit">
    <div className="vertSplitCol">
    <TextEditor renderOptions={renderOptions}/>
    </div>
    <div className="vertSplitCol">
    <NodeEditor/>
    </div>
  </div>
  <ThemeSelector />
  </>);
}

export default MainWindow;
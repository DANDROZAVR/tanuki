package org.tanuki;

import imgui.ImGui;
import imgui.ImGuiIO;
import imgui.app.Application;
import imgui.app.Configuration;
import imgui.flag.ImGuiWindowFlags;
import imgui.type.ImString;
import org.tanuki.network.HTTPClient;

public class Main extends Application {
    private final static int PADDING = 20;
    private final static int MARGIN = 10;
    public ImString is = new ImString();
    @Override
    protected void configure(Configuration config) {
        config.setTitle("Tanuki");
    }

    @Override
    public void process() {
        ImGui.begin("Tanuki", ImGuiWindowFlags.NoTitleBar | ImGuiWindowFlags.NoResize | ImGuiWindowFlags.NoMove);
        ImGui.setWindowPos(-MARGIN, -MARGIN);
        ImGuiIO io = ImGui.getIO();
        ImGui.setWindowSize(io.getDisplaySizeX() + 2*MARGIN,io.getDisplaySizeY() + 2*MARGIN);
        ImGui.getStyle().setWindowPadding(PADDING + MARGIN, PADDING + MARGIN);

        ImGui.inputTextMultiline("Code", is);

        if( ImGui.button("Send") ) {
            HTTPClient.request("localhost", is.get());
        }
        ImGui.end();
    }

    @Override
    protected void initImGui(Configuration config) {
        super.initImGui(config);

        ImGuiIO io = ImGui.getIO();
        io.getFonts().addFontFromFileTTF("src/res/OpenSans-Regular.ttf",25);

    }

    public static void main(String[] args) {
        //perhaps choosing the server should be written better
        launch(new Main());
    }
}
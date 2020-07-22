import GNote from "./gnote.js"

export default {
    data() {
        return {
            editor: null,
            changed: false,
            data: null,
            now: new Date().toLocaleString()
        };
    },
    computed: {
        selectedFolderName() {
            const folder = this.$store.getters.selectedFolder;
            if (!folder)
                return "";

            return folder.name;
        },

        textCount() {
            return 0;
        },

        noteChange() {
            const note = this.$store.getters.selectedNote;
            return note;
        },
    },

    watch: {
        async noteChange(note) {
            if (!note) {
                this.data = null;
                return;
            }

            this.data = await GNote.noteContent(note.id);

            //有可能输入是纯数字
            if (!isNaN(this.data)) {
                // this.data = this.data.toString();
            }
            this.editor.setValue(this.data);
        },

        data(val) {
            console.log(val);
        }
    },
    mounted() {
        this.editor = CodeMirror.fromTextArea(document.querySelector("#codemirror-editor"), {
            tabSize: 4,
            scrollbarStyle: "simple",
            cursorHeight: 0.40,
            extraKeys: {
                /*
                "Esc": function() {
                }
                */
            },
        });

        this.editor.on("change", (codemirror, changeObject) => {
            this.data = codemirror.getValue();
            this.changed = true;
        });
    },

    template: `
    <div class="edit-wrapper">
        <div class="edit-status">
            <i class="edge"></i>
            <div class="edit-mode">纯文本模式</div>
            <div class="status-bar">
                <div class="folder">
                    <span>{{ selectedFolderName }}</span>
                    <i></i>
                </div>
                <span class="split-line"></span>
                <span class="time">{{ now }}</span>
                <span class="split-line"></span>
                <span class="counter">共 {{ textCount }} 字</span>
                <span class="split-line"></span>
                <span class="favorite"></span>
            </div>
        </div>
        <div class="edit-main">
            <i></i>
            <div class="edit-area" id="edit-area">
                <div class="edge"></div>
                <div class="note-editor" id="note-editor">
                    <textarea id='codemirror-editor' style='display: none;'></textarea>
                </div>
            </div>
        </div>
    </div>
    `
}
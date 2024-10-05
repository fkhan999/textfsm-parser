let selected_mode = "textfsm";
let split_size = 2;

document.getElementById('text_input').value = 'Enter your CLI text here';
document.getElementById('template').value = `And your ${selected_mode} template here`;
document.getElementById('result').value = `View your result here`;

var txt_area = document.getElementById("text_input");
var text_editor = CodeMirror.fromTextArea(txt_area, {
        lineNumbers: true,
        theme: "shadowfox",
        matchBrackets: true,
        mode: "javascript",
        indentWithTabs: true,
        tabMode: "indent",
        indentUnit: 4,
        delay: { "show": 500, "hide": 100 },
});

var template_area = document.getElementById("template");
var template_editor = CodeMirror.fromTextArea(template_area, {
        lineNumbers: true,
        theme: "shadowfox",
        mode: "javascript",
        indentWithTabs: true,
        tabMode: "indent",
        indentUnit: 0,
        delay: { "show": 500, "hide": 100 },
});

var result_area = document.getElementById("result");
var result_editor = CodeMirror.fromTextArea(result_area, {
        lineNumbers: true,
        theme: "shadowfox",
        mode: "javascript",
        indentWithTabs: true,
        tabMode: "indent",
        indentUnit: 4,
        delay: { "show": 300, "hide": 100 },
        readOnly: true,
});

text_editor.on('change', (e) => {
    const template_text = template_editor.doc.getValue();
    const cli_text = text_editor.getDoc().getValue();
    $.post(`/api/${selected_mode}/`, { "inputtext": cli_text, "fsmtxt": template_text }, function (result) {   
            result_editor.setOption("lineSeparator", null);
            result_editor.setOption("mode", "javascript");
            var jsonPretty = JSON.stringify(result, null, '\t');
            result_editor.getDoc().setValue(jsonPretty);
    
    });
});

template_editor.on('change', () => {
    const template_text = template_editor.doc.getValue();
    const cli_text = text_editor.getDoc().getValue();
    // $.post(`/api/${selected_mode}/`, { "inputtext": cli_text, "fsmtxt": template_text },
    //  function (result) {   
    //         result_editor.setOption("lineSeparator", null);
    //         result_editor.setOption("mode", "javascript");
    //         var jsonPretty = JSON.stringify(result, null, '\t');
    //         result_editor.getDoc().setValue(jsonPretty);
    
    // });
    $.ajax({
        type: "POST",
        url: `/api/${selected_mode}/`,
        data: { "inputtext": cli_text, "fsmtxt": template_text },
        headers: { "X-CSRFToken": `{{csrf_token}}` },
        success: function (result) {
            result_editor.setOption("lineSeparator", null);
            result_editor.setOption("mode", "javascript");
            var jsonPretty = JSON.stringify(result, null, '\t');
            result_editor.getDoc().setValue(jsonPretty);
        }
    });
});


function doSplit(split_array) {
    if (split_size != split_array.length){
        $(".gutter-horizontal").remove();
        Split(split_array, {
            gutterSize: 4,
        });
        split_size = split_array.length;
    }
};

function setParseMode(mode) {
    var split_js = undefined;
    selected_mode = mode;
    template_editor.getDoc().setValue(`And your ${selected_mode} template here`);
    template_editor.setOption("readOnly", false);


    if (selected_mode == "textfsm"){
        $("#split-1").show();
        $("#template_textarea").show();
        text_editor.getDoc().setValue(`Enter your CLI here`);
        result_editor.getDoc().setValue(`View your rendered data here`);
        text_editor.setOption("mode", "javascript");
        template_editor.setOption("mode", "javascript");
        doSplit(['#split-0', '#split-1', '#split-2']);
    } 

}
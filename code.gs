function doGet(e){
    if(Object.getOwnPropertyNames(e.parameter).length == 0){
        return HtmlService
        .createTemplateFromFile("index")
        .evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setTitle("SwiTech - Project Gestionnary");
    } else {
        if(e.parameter['projet'] != undefined){
            if(e.parameter.token != undefined){
                PropertiesService.getUserProperties().setProperty('token', e.parameter.token);
            }
            PropertiesService.getScriptProperties().setProperty("project", e.parameter.projet);
            try {
                return HtmlService
                .createTemplateFromFile("project")
                .evaluate()
                .setTitle("SwiTech - Project Viewer");
            } catch(e) {
                return HtmlService
                .createHtmlOutputFromFile('404')
                .setTitle("Error 404");
            }
        } else if(e.parameter['page'] != undefined){
            if(e.parameter.token != undefined){
                PropertiesService.getUserProperties().setProperty('token', e.parameter.token);
            }
            if(e.parameter['page'] == 'newproject'){
                return HtmlService
                .createTemplateFromFile("new_project")
                .evaluate()
                .setTitle("SwiTech - Create Project");
            } else if(e.parameter['page'] == 'modify') {
                PropertiesService.getScriptProperties().setProperty("modify", e.parameter['project'])
                return HtmlService
                .createTemplateFromFile("modify")
                .evaluate()
                .setTitle("SwiTech - Modify Project");
            }
        } else {
            if(e.parameter.token != undefined){
                PropertiesService.getUserProperties().setProperty('token', e.parameter.token);
            }
            return HtmlService
            .createTemplateFromFile("index")
            .evaluate()
            .setSandboxMode(HtmlService.SandboxMode.IFRAME)
            .setTitle("SwiTech - Project Gestionnary");
        }
    }
}

function getAllProject(status){
    var projectSpread = SpreadsheetApp.openById("1OeP2DKzEYcP5QCLzUEvKjoUeREtcDbxhjUMSfH2j7wM").getSheets()[0];
    var project = projectSpread.getSheetValues(1, 1, projectSpread.getMaxRows(), projectSpread.getMaxColumns());
    var retProj = [];
    if(!status){
        for each(var row in project){
            if(!row[5].indexOf("Completed")){
                retProj.push(row);
            }
        }
    } else {
        for each(var row in project){
            if(row[5].indexOf("Completed")){
                retProj.push(row);
            }
        }
    }
    Logger.log(retProj);
    return retProj;
}

function getCurrentProject(projectName){
    var projectSpread = SpreadsheetApp.openById("1OeP2DKzEYcP5QCLzUEvKjoUeREtcDbxhjUMSfH2j7wM").getSheets()[0];
    var project = projectSpread.getSheetValues(1, 1, projectSpread.getMaxRows(), projectSpread.getMaxColumns());
    for each(var line in project){
        if(line[8] == projectName){
            return line;
        }
    }
    return null;
}

function returnCurrentProject(){
    return PropertiesService.getScriptProperties().getProperty("project");
}

function returnCurrentProjectM(){
    return PropertiesService.getScriptProperties().getProperty("modify");
}

function getScriptUrl(){
    return ScriptApp.getService().getUrl();
}

function deleteLineProject(projectId) {
    var projectSpread = SpreadsheetApp.openById("1OeP2DKzEYcP5QCLzUEvKjoUeREtcDbxhjUMSfH2j7wM").getSheets()[0];
    var range = projectSpread.getRange(1, 1, projectSpread.getMaxRows(), projectSpread.getMaxColumns()).getValues();
    var i = -1;
    var rowindex = 0;
    var rest = false;
    for(var row in range){
        if(range[row][8] == projectId && rest == false){
            rowindex = i + 2;
            rest = true;
            projectSpread.deleteRow(rowindex);
            continue
        }
        if(rest){
            rowindex = i + 2;
            projectSpread.getRange(rowindex, 9).setValue(i);
        }
        i ++;
    }
}

function addProject(values){
    var projectSpread = SpreadsheetApp.openById("1OeP2DKzEYcP5QCLzUEvKjoUeREtcDbxhjUMSfH2j7wM").getSheets()[0];
    projectSpread.appendRow([values[0], values[2], Utilities.formatDate(new Date(values[3]), "CET", "yyyy/MM/dd"), Utilities.formatDate(new Date(values[4]), "CET", "yyyy/MM/dd"), getTime(new Date(values[3]), new Date(values[4])), values[5], values[6], values[1], projectSpread.getMaxRows() - 1, values[7], values[8]]);
}

function modifyProject(values){
    var projectSpread = SpreadsheetApp.openById("1OeP2DKzEYcP5QCLzUEvKjoUeREtcDbxhjUMSfH2j7wM").getSheets()[0];
    var arr = []
    var date1 = new Date(values[3]);
    var date2 = new Date(values[4]);
    var delta = getTime(date1, date2);
    arr.push(values[0], values[2], Utilities.formatDate(date1, "CET", "yyyy/MM/dd"), Utilities.formatDate(date2, "CET", "yyyy/MM/dd"), delta, values[5], values[6], values[1], values[7], values[8], values[9]);
    projectSpread.getRange(Number(values[7]) + 2, 1, 1, projectSpread.getMaxColumns()).setValues([arr]);
}

function getTime(date1, date2){
    var newdate = Math.floor(Math.abs(date1 - date2) / (1000*60*60));
    return newdate;
}

function tokenValidRequest(token){
    return UrlFetchApp.fetch("https://script.google.com/macros/s/AKfycbxuepLyMQTWt_HvAy_fBKUhqcSc0yDQFCGIdUQNzMu5YgjgdfU/exec?action=checkvalidity&token=" + token + "&email=" + Session.getActiveUser().getEmail()).getContentText();
}

function getUserCache(){
    Logger.log(PropertiesService.getUserProperties().getProperty('token'));
    return PropertiesService.getUserProperties().getProperty('token');
}

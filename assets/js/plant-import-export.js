let inProgress = undefined;
const baseUrl = 'https://api.blossm.garden';

function handleImport() {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }

    let input = document.getElementById('file-input');
    if (!input) {
        setErrorMessage("Um, couldn't find the #file-input element.");
    } else if (!input.files) {
        setErrorMessage("This browser doesn't seem to support the `files` property of file inputs.");
    } else if (!input.files[0]) {
        setErrorMessage("Please select a file before clicking 'Import'");
    } else {
        const fd = new FormData();
        const files = input.files[0];
        let token = $('#inputToken').val();
        if (token === undefined || token === "") {
            return;
        }
        fd.append('file', files);
        setLoading();
        inProgress = $.ajax({
            url: baseUrl + '/plant/import',
            headers: {'X-Api-Token': token},
            type: 'post',
            crossDomain: true,
            data: fd,
            contentType: false,
            processData: false,
            success: function () {
                inProgress = null;
                removeLoading();
                setSuccessMessage("Import success");
            },
            error: handleAjaxError
        });
    }
}

function abort() {
    inProgress.abort();
}

function handleExport() {
    let token = $('#inputToken').val();
    if (token === undefined || token === "") {
        return;
    }
    inProgress = $.ajax({
        url: baseUrl + '/plant/export',
        headers: {'X-Api-Token': token},
        method: 'get',
        crossDomain: true,
        xhrFields: {
            responseType: 'blob'
        },
        success: function (data) {
            inProgress = null;
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = 'plant.csv';
            document.body.append(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        },
        error: handleAjaxError
    });
}

function setErrorMessage(message) {
    $('#error-modal-content').html(message);
    $('#error-modal').modal({focus: true, show: true});
}

function setSuccessMessage(message) {
    $('#success-modal-content').html(message);
    $('#success-modal').modal({focus: true, show: true});
}

function setLoading() {
    $('#loading-modal').modal({focus: true, show: true});
}

function removeLoading() {
    $('#loading-modal').modal('toggle');
}

function handleAjaxError(error) {
    setTimeout(function () {
        removeLoading();
        if (error.status === 401 || error.status === 403) {
            setErrorMessage("Bad token");
            return;
        }
        if (inProgress === undefined) {
            return;
        }
        inProgress = undefined;
        if (error.responseJSON === undefined) {
            setErrorMessage("Error status code is " + error.status);
            return;
        }
        let message = error.responseJSON.message;
        setErrorMessage(message);
    }, 1_000);


}
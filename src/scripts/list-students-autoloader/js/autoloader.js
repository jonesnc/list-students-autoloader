import _ from 'underscore';
import $ from 'jquery';
import '../css/print-list.css'

export default function() {
  var template = $($('#template').html());
  var select = $('table td').eq(0);
  select.append(template);

  var saveButtonTemplate = $($('#save-button-template').html());
  var btnSubmit = $('#btnSubmit');
  saveButtonTemplate.insertBefore(btnSubmit);

  var newButtonTemplate = $($('#new-button-template').html());
  var saveSubmit = $('#saveSubmit');
  newButtonTemplate.insertBefore(saveSubmit);

  var deleteButtonTemplate = $($('#delete-button-template').html());
  var saveBtn = $('#saveSubmit');
  deleteButtonTemplate.insertBefore(saveBtn);

  var noteTemplate = $($('#note-template').html());
  var headerSelect = $('h1');
  noteTemplate.insertAfter(headerSelect);

  var clearFormTemplate = $($('#clear-form-template').html());
  var clearFormSelector = $('input').eq(0);
  clearFormTemplate.insertAfter(clearFormSelector);

  $('#clear-form').on('click', function(e) {
    // Clear the form by not passing in a report variable to loadFormFields.
    loadFormFields();
  });

  // Bind Field Name input boxes event handler
  var inputs = $('input').filter(function() {
    return this.id.indexOf('tt') !== -1;
  });

  inputs.off('click');
  inputs.css({visibility: 'visible'});

  $('#btnDelete').makeConfReqButton();

  // Load saved user and global list reports.
  var reports = [];

  $.when($.get('/ws/schema/table/U_DEF_AUTOLOADER_LISTS?q=usersdcid==' + psData.userDCID + '&projection=*'), $.get('/ws/schema/table/U_DEF_GLOBAL_LISTS?projection=*')).done(function(userReportsData, globalReportsData) {
    var autoloaderTableName = userReportsData[0]['name'].toLowerCase();
    var userReports = userReportsData[0]['record'];

    var globalListsTableName = globalReportsData[0]['name'].toLowerCase();
    var globalReports = globalReportsData[0]['record'];

    // Add all elements from both userReports and globalReports to reports Array.
    reports = userReports.concat(globalReports);

    // Insert list option tags into #loadlist select
    _.each(globalReports, function(report) {
      var reportData = report['tables'][globalListsTableName];
      var loadListTemplate = $('#global-load-list-template').html();

      // Get the Global Lists option.
      var globalReportsOption = _.filter($('#loadlist').children(), function(elem) {
        return $(elem).val() === 'Global Lists';
      });

      // Get the next option in the select tag, which is the dash-separator option.
      var select = $(globalReportsOption).next();
      var compiledTemplate = _.template(loadListTemplate);
      var renderedTemplate = compiledTemplate({report: reportData});

      $(renderedTemplate).insertAfter(select);
    });

    _.each(userReports, function(report) {
      var reportData = report['tables'][autoloaderTableName];
      var loadListTemplate = $('#user-load-list-template').html();

      // Index of User Reports option in an Array of all child options of #loadlist.
      var userReportsOption = _.filter($('#loadlist').children(), function(elem) {
        return $(elem).val() === 'User Lists';
      });

      if (!reportData['report_title']) {
        reportData['report_title'] = '{Report With No Name}';
      }

      // Get the next option in the select element, which is the dash-separator option.
      var select = $(userReportsOption).next();
      var compiledTemplate = _.template(loadListTemplate);
      var renderedTemplate = compiledTemplate({report: reportData});

      $(renderedTemplate).insertAfter(select);
    });

    $('#loadlist').on('change', function() {

      var selectedOption = getSelectedOption();
      if (selectedOption) {
        var selectedOptionId = selectedOption.data().id;
        if (selectedOptionId) {
          var selectedReport = _.filter(reports, function(currData) {
            return currData.id === selectedOptionId;
          });

          var selectedReportObj;
          // If the users key is present, this implies that this report is
          // a user report because it is linked to a User record.
          if (selectedReport[0]['tables']['users']) {
            selectedReportObj = selectedReport[0]['tables'][autoloaderTableName];
          } else {
            selectedReportObj = selectedReport[0]['tables'][globalListsTableName];
          }
          loadFormFields(selectedReportObj);
          // Make sure delete and save button is only visible for user lists.
          if (selectedOption.data().type === 'global') {
            $('.btnConfirmProxy').css({visibility: 'hidden'});
            $('#saveSubmit').css({visibility: 'hidden'});
          } else {
            $('.btnConfirmProxy').css({visibility: 'visible'})
            $('#saveSubmit').css({visibility: 'visible'});
          }
        }
      }
    });

    var extraFieldsTemplate = $($('#extra-pref-fields-template').html());
    $('form').append(extraFieldsTemplate);

    $('form').on('submit', function(e) {
      var formObj = serializeFormToObject();
      var matchingReport = _.find(reports, function(elem) {
        var tempObj = {};
        $.extend(tempObj, elem);

        // Remove properties from tempObj that aren't present in the form.
        tempObj.dcid = null;
        tempObj.id = null;
        tempObj.report_title = null;
        tempObj.type = null;

        return _.isEqual(formObj, tempObj);
      });

      if (matchingReport) {
        var reportIdElem = $('#report-id');
        var reportTypeElem = $('#report-type');

        reportIdElem.val(matchingReport.id);
        reportTypeElem.val(matchingReport.type);
      }

      // Make sure all column names have an associated Field Name.
      // If this isn't checked, a Java Exception will be displayed.
      var columnMissingTemplate = $($('#column-missing-template').html());
      $('.error-message').remove();
      var formValid = true;
      if (formObj.column_title1 && !formObj.field_name1) {
        columnMissingTemplate.clone().insertAfter($('#tt1').next());
        formValid = false;
      }
      if (formObj.column_title2 && !formObj.field_name2) {
        columnMissingTemplate.clone().insertAfter($('#tt2').next());
        formValid = false;
      }
      if (formObj.column_title3 && !formObj.field_name3) {
        columnMissingTemplate.clone().insertAfter($('#tt3').next());
        formValid = false;
      }
      if (formObj.column_title4 && !formObj.field_name4) {
        columnMissingTemplate.clone().insertAfter($('#tt4').next());
        formValid = false;
      }
      if (formObj.column_title5 && !formObj.field_name5) {
        columnMissingTemplate.clone().insertAfter($('#tt5').next());
        formValid = false;
      }
      if (formObj.column_title6 && !formObj.field_name6) {
        columnMissingTemplate.clone().insertAfter($('#tt6').next());
        formValid = false;
      }
      if (formObj.column_title7 && !formObj.field_name7) {
        columnMissingTemplate.clone().insertAfter($('#tt7').next());
        formValid = false;
      }
      if (formObj.column_title8 && !formObj.field_name8) {
        columnMissingTemplate.clone().insertAfter($('#tt8').next());
        formValid = false;
      }
      if (formObj.column_title9 && !formObj.field_name9) {
        columnMissingTemplate.clone().insertAfter($('#tt9').next());
        formValid = false;
      }
      if (formObj.column_title10 && !formObj.field_name10) {
        columnMissingTemplate.clone().insertAfter($('#tt10').next());
        formValid = false;
      }
      if (!formValid) {
        return false;
      }
    });

    var loadOptions = $('#loadlist').children();

    // Get DOM option element that corresponds to previously run report.
    var loadListOption = _.filter(loadOptions, function(elem) {
      return $(elem).data().type === psData.lastRunReportType && $(elem).data().id.toString() === psData.lastRunReportId;
    });

    // Hide Delete button on load if the last report that was run was a global report.
    if (loadListOption.length > 1) {
      $(loadListOption[0]).prop({'selected': true});

      if ($(loadListOption).data().type === 'global') {
        $('.btnConfirmProxy').css({visibility: 'hidden'});
        $('#saveSubmit').css({visibility: 'hidden'});
      }
    }

    /**
       *
       * @returns {jQuery|*} Returns the selected option in #loadlist if it's a valid selection. Return undefined
       * if the currently selected option is not a valid report.
       */
    function getSelectedOption() {
      var selectedOption = $('#loadlist').children().filter(':selected').eq(0);

      // If the option's text includes any of these characters, it's not a valid selection that corresponds to an actual report.
      if (selectedOption.text() === '' || selectedOption.text() === '--------------' || selectedOption.text().indexOf('Lists') !== -1) {
        selectedOption = undefined;
      }
      return selectedOption;
    }

    $('#saveSubmit').on('click', function(e) {
      e.preventDefault();
      loadingDialogInstance.open();
      var formObj = serializeFormToObject();
      var formData;

      var selectedOption = getSelectedOption();

      // If an option is selected, check if the report they selected is the same exact settings in the form
      // If so, just edit that report instead of making a new entry.
      // If both of those conditions aren't true, make a new report record.
      if (selectedOption) {
        formData = serializeFormToObject();
        var selectedOptionId = selectedOption.data().id;
        formData = serializeFormForPost(selectedOptionId);

      } else {
        formData = serializeFormForPost();
      }

      formData.push({name: 'ac', value: 'prim'});
      var encodedData = $.param(formData);

      // In order for POST requests to work with child database extension tables,
      // a page using the ~[tlist_child] tag must first be loaded.
      // The contents of the page are never used, but for some reason any POST requests that change child tables will return a
      // security violation if the enable_requests page isn't loaded first.
      $.get('/admin/studentlist/enable_requests.html?frn=204' + psData.userDCID, function(enableResp) {
        $.ajax({
          data: encodedData,
          type: 'POST',
          url: '/admin/changesrecorded.white.html',
          success: function(msg) {
            window.location = '/admin/changesrecorded.white.html';
          }
        });
      });
    });

    $('#newSubmit').on('click', function(e) {
      e.preventDefault();
      loadingDialogInstance.open();
      var formObj = serializeFormToObject();
      var formData;

      var selectedOption = getSelectedOption();
      formData = serializeFormForPost();

      formData.push({name: 'ac', value: 'prim'});
      var encodedData = $.param(formData);

      // In order for POST requests to work with child database extension tables,
      // a page using the ~[tlist_child] tag must first be loaded.
      // The contents of the page are never used, but for some reason any POST requests that change child tables will return a
      // security violation if the enable_requests page isn't loaded first.
      $.get('/admin/studentlist/enable_requests.html?frn=204' + psData.userDCID, function(enableResp) {
        $.ajax({
          data: encodedData,
          type: 'POST',
          url: '/admin/changesrecorded.white.html',
          success: function(msg) {
            window.location = '/admin/changesrecorded.white.html';
          }
        });
      });
    });

    $('#btnDelete').on('click', function() {
      loadingDialogInstance.open();
      var selectedReportId = $('#loadlist').children().filter(':selected').data().id;
      if (selectedReportId) {
        var postData = [];
        postData.push({
          name: 'DC-Users:' + psData.userDCID + '.U_AUTOLOADER.U_DEF_AUTOLOADER_LISTS:' + selectedReportId,

          value: 'on'
        });
        postData.push({name: 'ac', value: 'prim'});
        $.get('/admin/studentlist/enable_requests.html?frn=204' + psData.userDCID, function() {
          $.ajax({
            data: postData,
            type: 'POST',
            url: '/admin/changesrecorded.white.html',
            success: function(msg) {
              window.location = '/admin/changesrecorded.white.html';
            }
          });
        });
      }
    });
  });

  function serializeFormToObject() {
    var formObj = {};
    var aFormElements = document.forms.aForm.elements;
    formObj.field_name1 = aFormElements[3].value;
    formObj.column_title1 = aFormElements[4].value;
    formObj.field_name2 = aFormElements[5].value;
    formObj.column_title2 = aFormElements[6].value;
    formObj.field_name3 = aFormElements[7].value;
    formObj.column_title3 = aFormElements[8].value;
    formObj.field_name4 = aFormElements[9].value;
    formObj.column_title4 = aFormElements[10].value;
    formObj.field_name5 = aFormElements[11].value;
    formObj.column_title5 = aFormElements[12].value;
    formObj.field_name6 = aFormElements[13].value;
    formObj.column_title6 = aFormElements[14].value;
    formObj.field_name7 = aFormElements[15].value;
    formObj.column_title7 = aFormElements[16].value;
    formObj.field_name8 = aFormElements[17].value;
    formObj.column_title8 = aFormElements[18].value;
    formObj.field_name9 = aFormElements[19].value;
    formObj.column_title9 = aFormElements[20].value;
    formObj.field_name10 = aFormElements[21].value;
    formObj.column_title10 = aFormElements[22].value;
    formObj.cell_padding = aFormElements[23].value;
    formObj.rows_breaks = aFormElements[24].value;
    if (aFormElements[26].checked) {
      formObj.gridlines = '1';
    } else {
      formObj.gridlines = '0';
    }
    if (aFormElements[27].checked) {
      formObj.export_val = '1';
    } else {
      formObj.export_val = '0';
    }

    formObj.sort_field_name1 = aFormElements[28].value;
    formObj.sort_dir1 = aFormElements[29].value;
    formObj.sort_field_name2 = aFormElements[30].value;
    formObj.sort_dir2 = aFormElements[31].value;
    formObj.sort_field_name3 = aFormElements[32].value;
    formObj.sort_dir3 = aFormElements[33].value;
    return formObj;
  }

  // Create a JavaScript object that matches the form ~[tlist_child] elements.
  function serializeFormForPost(recordId) {
    var extensionName = 'U_AUTOLOADER';
    var tableName = 'U_DEF_AUTOLOADER_LISTS';
    var formData = [];
    var formInputs = $(':input').filter(':not("[type=hidden]")').filter(':not("button")').filter(':not("#loadlist")').filter(':not(".headerrow")');

    // Field names of database extension table in the order they appear on the form.
    var customfield_names = [
      'report_title',
      'field_name1',
      'column_title1',
      'field_name2',
      'column_title2',
      'field_name3',
      'column_title3',
      'field_name4',
      'column_title4',
      'field_name5',
      'column_title5',
      'field_name6',
      'column_title6',
      'field_name7',
      'column_title7',
      'field_name8',
      'column_title8',
      'field_name9',
      'column_title9',
      'field_name10',
      'column_title10',
      'cell_padding$format=numeric',
      'rows_breaks$format=numeric',
      'gridlines',
      'export',
      'sort_field_name1',
      'sort_dir1',
      'sort_field_name2',
      'sort_dir2',
      'sort_field_name3',
      'sort_dir3'
    ];

    //CF-[{Parent table name}:{Foreign key to Users table}.{ExtensionGroup}.{ExtensionTable}:-1]{ColumnName}
    _.each(formInputs, function(elem, index) {
      var formKeyName = 'CF-[Users:' + psData.userDCID + '.' + extensionName + '.' + tableName + ':';
      if (!recordId) {
        formKeyName += '-1';
      } else {
        formKeyName += recordId;
      }
      formKeyName += ']' + customfield_names[index];

      if (formInputs.eq(index).attr('type') === 'checkbox') {
        formData.push({
          name: formKeyName,
          value: formInputs.eq(index).is(':checked')
            ? 1
            : 0
        });
      } else if (formInputs.get(index).nodeName === 'SELECT') {
        formData.push({
          name: formKeyName,
          value: formInputs.eq(index).val() === '<'
            ? 'a'
            : 'd'
        });
      } else {
        formData.push({name: formKeyName, value: formInputs.eq(index).val()});
      }
    });
    return formData;
  }

  function loadFormFields(report) {
    var aFormElements = document.forms.aForm.elements;
    if (report) {
      aFormElements[0].value = report.hasOwnProperty('report_title')
        ? report.report_title
        : '';
      aFormElements[3].value = report.hasOwnProperty('field_name1')
        ? report.field_name1
        : '';
      aFormElements[4].value = report.hasOwnProperty('column_title1')
        ? report.column_title1
        : '';
      aFormElements[5].value = report.hasOwnProperty('field_name2')
        ? report.field_name2
        : '';
      aFormElements[6].value = report.hasOwnProperty('column_title2')
        ? report.column_title2
        : '';
      aFormElements[7].value = report.hasOwnProperty('field_name3')
        ? report.field_name3
        : '';
      aFormElements[8].value = report.hasOwnProperty('column_title3')
        ? report.column_title3
        : '';
      aFormElements[9].value = report.hasOwnProperty('field_name4')
        ? report.field_name4
        : '';
      aFormElements[10].value = report.hasOwnProperty('column_title4')
        ? report.column_title4
        : '';
      aFormElements[11].value = report.hasOwnProperty('field_name5')
        ? report.field_name5
        : '';
      aFormElements[12].value = report.hasOwnProperty('column_title5')
        ? report.column_title5
        : '';
      aFormElements[13].value = report.hasOwnProperty('field_name6')
        ? report.field_name6
        : '';
      aFormElements[14].value = report.hasOwnProperty('column_title6')
        ? report.column_title6
        : '';
      aFormElements[15].value = report.hasOwnProperty('field_name7')
        ? report.field_name7
        : '';
      aFormElements[16].value = report.hasOwnProperty('column_title7')
        ? report.column_title7
        : '';
      aFormElements[17].value = report.hasOwnProperty('field_name8')
        ? report.field_name8
        : '';
      aFormElements[18].value = report.hasOwnProperty('column_title8')
        ? report.column_title8
        : '';
      aFormElements[19].value = report.hasOwnProperty('field_name9')
        ? report.field_name9
        : '';
      aFormElements[20].value = report.hasOwnProperty('column_title9')
        ? report.column_title9
        : '';
      aFormElements[21].value = report.hasOwnProperty('field_name10')
        ? report.field_name10
        : '';
      aFormElements[22].value = report.hasOwnProperty('column_title10')
        ? report.column_title10
        : '';
      aFormElements[23].value = report.hasOwnProperty('cell_padding')
        ? report.cell_padding
        : '';
      aFormElements[24].value = report.hasOwnProperty('rows_breaks')
        ? report.rows_breaks
        : '';

      if (report.hasOwnProperty('gridlines')) {
        if (!report.gridlines || report.gridlines === '0') {
          aFormElements[26].checked = false;
        } else {
          aFormElements[26].checked = true;
        }
      }

      if (report.hasOwnProperty('export_val')) {
        if (!report.export_val || report.export_val === '0') {
          aFormElements[27].checked = false;
        } else {
          aFormElements[27].checked = true;
        }
      }
      aFormElements[28].value = report.hasOwnProperty('sort_field_name1')
        ? report.sort_field_name1
        : '';
      if (report.hasOwnProperty('sort_dir1')) {
        report.sort_dir1 === 'a'
          ? aFormElements[29].value = '<'
          : aFormElements[29].value = '>';
      }
      aFormElements[30].value = report.hasOwnProperty('sort_field_name2')
        ? report.sort_field_name2
        : '';
      if (report.hasOwnProperty('sort_dir2')) {
        report.sort_dir2 === 'a'
          ? aFormElements[31].value = '<'
          : aFormElements[31].value = '>';
      }
      aFormElements[32].value = report.hasOwnProperty('sort_field_name3')
        ? report.sort_field_name3
        : '';
      if (report.hasOwnProperty('sort_dir3')) {
        report.sort_dir3 === 'a'
          ? aFormElements[33].value = '<'
          : aFormElements[33].value = '>';
      }
      aFormElements[34].value = 'prim';
    } else {
      aFormElements[0].value = '';
      aFormElements[3].value = '';
      aFormElements[4].value = '';
      aFormElements[5].value = '';
      aFormElements[6].value = '';
      aFormElements[7].value = '';
      aFormElements[8].value = '';
      aFormElements[9].value = '';
      aFormElements[10].value = '';
      aFormElements[11].value = '';
      aFormElements[12].value = '';
      aFormElements[13].value = '';
      aFormElements[14].value = '';
      aFormElements[15].value = '';
      aFormElements[16].value = '';
      aFormElements[17].value = '';
      aFormElements[18].value = '';
      aFormElements[19].value = '';
      aFormElements[20].value = '';
      aFormElements[21].value = '';
      aFormElements[22].value = '';
      aFormElements[23].value = '';
      aFormElements[24].value = '';
      aFormElements[26].checked = false;
      aFormElements[27].checked = false;
      aFormElements[28].value = '';
      aFormElements[29].value = '>';
      aFormElements[30].value = '';
      aFormElements[31].value = '>';
      aFormElements[32].value = '';
      aFormElements[33].value = '>';
      aFormElements[34].value = 'prim';
    }
  }
}

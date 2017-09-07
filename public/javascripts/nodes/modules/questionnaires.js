/* globals questnr, storage, slickModal, utils */
/**
 * Module: Questionnaires
 */

questnr.addNode("modules", "questionnaires", ($module, module) => {
    "use strict";
    let ajax = questnr.getNode('core', 'ajax');
    let store = storage(questnr.getNode('core', 'storeKey')());

    module.configure('events')
        .node('onRangeDrag', (clb) => {
            $module.on('input', '[type="range"]', clb);
        })
        .node('onToggleQ', (clb) => {
            $module.find('.trigger.toggle-questionnaire').add($module.find('.questionnaire-header')).on('click', clb);
        })
        .node('onCreateQ', (clb) => {
            $module.find('.trigger.create-questionnaire').on('click', clb);
        })
        .node('onAddQuestion', (clb) => {
            $('body').on('click', '.slick-modal.create-questionnaire .trigger.add-question', clb);
        })
        .node('onRemoveQuestion', (clb) => {
            $('body').on('click', '.slick-modal.create-questionnaire .trigger.remove-question', clb);
        })
        .node('onAssignUsers', (clb) => {
            $('body').on('click', '.slick-modal.create-questionnaire .trigger.assign-users', clb);
        })
        .node('onAssignBulk', (clb) => {
            $('body').on('click', '.slick-modal.create-questionnaire .trigger.assign-bulk', clb);
        })
        .node('onUserSelect', (clb) => {
            $('body').on('click', '.slick-modal.create-questionnaire .users-dropdown .user', clb);
        })
        .node('onUsersSelect', (clb) => {
            $('body').on('click', '.slick-modal.create-questionnaire .trigger.select-users', clb);
        })
        .node('onUsersClear', (clb) => {
            $('body').on('click', '.slick-modal.create-questionnaire .trigger.clear-users', clb);
        })
        .node('onUsersClose', (clb) => {
            $('body').on('click', '.slick-modal.create-questionnaire .trigger.close-users', clb);
        })
        .node('onSubmitQByUser', (clb) => {
            $module.find('.trigger.submit-questionnaire').on('click', clb);
        })
        .node('sortAsc', (clb) => {
            $module.on('click', '.trigger.sort-asc', clb);
        })
        .node('sortDesc', (clb) => {
            $module.on('click', '.trigger.sort-desc', clb);
        })
        .node('onLimitSelect', (clb) => {
            $module.find('[name="limit"]').on('change', clb);
        })
        .node('onFilterSelect', (clb) => {
            $module.find('[name="filter"]').on('change', clb);
        })
        .node('onSearch', (clb) => {
            $module.find('.trigger.search').on('click', clb);
        })
        .node('onClear', (clb) => {
            $module.find('.trigger.clear-results').on('click', clb);
        })
        .node('onSelectAll', (clb) => {
            $module.find('.all-questionnaires').find('.questionnaires-table-header').find('.questionnaire-selector').find('[type="checkbox"]').on('change', clb);
        })
        .node('onSelectQ', (clb) => {
            $module.find('.all-questionnaires').find('.questionnaires-table').find('.questionnaire-selector').find('[type="checkbox"]').on('change', clb);
        })
        .node('onViewQ', (clb) => {
            $module.on('click', '.trigger.view-questionnaire', clb);
        })
        .node('onBulkAction', (clb) => {
            $module.find('.trigger.trigger-bulk-action').on('click', clb);
        });

    module.configure('renderers')
        .node('syncQuestionsIndexes', () => {
            $('.slick-modal.create-questionnaire').find('.question').each((i, e) => {
                $(e).find('.question-index').html(i + 1);
            });
        })
        .node('showUsersDropdown', (users, assignedUsers, isSelected) => {
            let $dropdown = $('.slick-modal.create-questionnaire').find('.users-dropdown');
            let html = '';
            $dropdown.find('.user').remove();
            (users || []).map((a) => {
                let selected = isSelected && isSelected(a._id, assignedUsers) ? 'selected' : '';
                html += `<div class="user ${selected}" data-id="${a._id}" data-email="${a.email}"><span class="name">${a.firstName} ${a.lastName}</span> <span class="email">${a.email}</span></div>`;
            });
            $dropdown.prepend(html);
            $dropdown.addClass('active');
        })
        .node('addQuestion', (data, $target) => {
            $target.append(`
            <div class="question">
                <div class="question-header">
                    <div class="question-index" title="Question index">${data.index}</div>
                    <a href="#" class="trigger remove-question" title="Remove question"><span class="icon fa fa-close"></span></a>
                </div>
                <div class="question-body">
                    <div class="question-text">
                        <input type="text" placeholder="Question text...">
                    </div>
                    <div class="question-type">
                        <select>
                            <option value="" selected disabled>Question type</option>
                            <option value="text">Text</option>
                            <option value="text-range">Text with range</option>
                            <option value="range">Range</option>
                            <option value="textarea">Textarea</option>
                        </select>
                    </div>
                </div>
            </div>`);
        })
        .node('dataSort', (sortBy, type, sortedCol, $items, $wrapper) => {
            let rows = [];
            let html = '';
            $items.each((i, e) => {
                let $el = $(e);
                rows.push({
                    html: $el,
                    val: $el.find(sortedCol).find('.value').text()
                });
            });

            if ( sortBy === 'a' ) {
                rows.sort((a, b) => {
                    if ( a.val.toLowerCase() > b.val.toLowerCase() ) {
                        return type === 'asc' ? 1 : -1;
                    }
                    if ( a.val.toLowerCase() < b.val.toLowerCase() ) {
                        return type === 'asc' ? -1 : 1;
                    }
                    return 0;
                });
            } else if ( sortBy === 'n' ) {
                rows.sort((a, b) => {
                    if ( a.val > b.val ) {
                        return type === 'asc' ? 1 : -1;
                    }
                    if ( a.val < b.val ) {
                        return type === 'asc' ? -1 : 1;
                    }
                    return 0;
                });
            } else if ( sortBy === 'd' ) {
                rows.sort((a, b) => {
                    return type === 'asc' ? new Date(a.val) - new Date(b.val) : new Date(b.val) - new Date(a.val);
                });
            }

            rows.forEach((a) => { html += a.html[0].outerHTML; });
            $wrapper.empty().append(html);
        });

    module.configure('actions')
        .node('isSelectedUser', (userID, users) => {
            let isSelected = false;
            users.map((a) => {
                if ( a.id === userID ) {
                    isSelected = true;
                }
            });
            return isSelected;
        })
        .node('getQuestions', () => {
            let questions = [];
            $('.slick-modal.create-questionnaire').find('.question').each((i, e) => {
                questions.push({
                    text: $(e).find('.question-text').find('input').val(),
                    type: $(e).find('.question-type').find('select').find('option:selected').val()
                });
            });
            return questions;
        })
        .node('getInvalidQuestions', (questions) => {
            let invalid = [];
            questions.forEach((a) => {
                // TODO: 5 and 200 must come from a server-side config
                if ( a.text.length <= 5 || a.text.length > 200 || a.type === '' ) {
                    invalid.push(a);
                }
            });
            return invalid;
        })
        .node('toggleQ', ($q, isOn) => {
            $q.find('input').attr('disabled', 'disabled');
            if ( !isOn ) {
                if ( $q.find('input[type="text"]').length > 0 ) {
                    $q.find('input[type="text"]').prop('disabled', true);
                }
                if ( $q.find('input[type="range"]').length > 0 ) {
                    $q.find('input[type="range"]')
                        .prop('disabled', true)
                        .data('plugin_rangeslider').update();
                }
                $q.addClass('to-be-submitted');
            } else {
                if ( $q.find('input[type="text"]').length > 0 ) {
                    $q.find('input[type="text"]').removeAttr('disabled');
                }
                if ( $q.find('input[type="range"]').length > 0 ) {
                    $q.find('.rangeslider--disabled').removeClass('rangeslider--disabled');
                }
                $q.removeClass('to-be-submitted');
            }
        })
        .node('getQAnswers', ($q) => {
            let answers = [];
            $q.find('.question').each((i, e) => {
                let $qst = $(e);
                let type = $qst.attr('data-type');
                answers[i] = {};
                switch ( type ) {
                    case 'text':
                        answers[i].text = $qst.find('input').val().trim();
                        break;
                    case 'text-range':
                        answers[i].text = $qst.find('input').val().trim();
                        answers[i].range = $qst.find('[type="range"]').val();
                        break;
                    case 'range':
                        answers[i].range = $qst.find('[type="range"]').val();
                        break;
                    case 'textarea':
                        answers[i].text = $qst.find('textarea').val().trim();
                        break;
                    default:
                        break;
                }
                answers[i].type = type;
            });
            return answers;
        })
        .node('validateQ', (format, answers) => {
            let isValid = true;
            answers.forEach((answer) => {
                switch ( answer.type ) {
                    case 'text':
                        console.log('TEXT!@#!@#');
                        answer.isValid = answer.text.length >= format.minLenShort && answer.text.length <= format.maxLenShort;
                        break;
                    case 'text-range':
                        answer.isValid = answer.text.length >= format.minLenShort && answer.text.length <= format.maxLenShort;
                        break;
                    case 'textarea':
                        answer.isValid = answer.text.length >= format.minLenLong && answer.text.length <= format.maxLenLong;
                        break;
                    default:
                        answer.isValid = true;
                        break;
                }
            });
            answers.forEach((answer, i) => {
                if ( ! answer.isValid && isValid ) {
                    isValid = false;
                    let min = answer.type === 'textarea' ? format.minLenLong : format.minLenShort;
                    let max = answer.type === 'textarea' ? format.maxLenLong : format.maxLenShort;
                    let $q = $module.find('.question').eq(i);
                    $q.addClass('error');
                    $q.find('input, textarea').focus();
                    $q.one('click keypress', () => { $q.removeClass('error'); });
                    notifier.notify({
                        type: 'error',
                        title: 'Error',
                        subtitle: `Answer [${$q.index() + 1}] must be in range [${min} - ${max}] symbols.`
                    });
                }
            });
            answers.forEach((answers) => {
                answers.isValid = undefined;
            });
            return isValid;
        })
        .node('init', () => {
            let m = module.getNodes();
            let questionsCounter = 0;
            let assignedUsers = [];
            let settings = store.getData();
            let users = [];

            $module.find('input[type="range"]').rangeslider({ polyfill : false });

            m.events.onRangeDrag((e) => {
                let $r = $(e.target);
                $r.attr('data-dragged', true);
                $r.closest('.question').find('.range-counter').html($r.val());
            });

            m.events.onToggleQ((e) => {
                let $q = $(e.target).closest('.questionnaire');
                if ( $q.is('.opened') ) {
                    $q.find('.questionnaire-body').slideUp(150, () => { $q.removeClass('opened'); });
                } else {
                    $q.find('.questionnaire-body').slideDown(150, () => { $q.addClass('opened'); });
                }
            });

            m.events.onCreateQ((e) => {
                e.preventDefault();
                slickModal({
                    selector: 'create-questionnaire',
                    title: 'Create new questionnaire',
                    confirmText: 'Create',
                    cancelText: 'Cancel',
                    fullscreen: true,
                    content: ''+
                        '<div class="modal-action">' +
                            '<a href="#" class="trigger add-question" title="Add question"><span class="icon fa fa-plus"></span> <span class="text">Add question</span></a>' +
                            '<a href="#" class="trigger assign-users" title="Assign users"><span class="icon fa fa-user"></span> <span class="text">Assign users</span></a>' +
                            '<a href="#" class="trigger assign-bulk" title="Assign bulk"><span class="icon fa fa-users"></span> <span class="text">Assign bulk</span></a>' +
                            '<div class="assigned-user" data-id="" title="No users assigned"><span class="icon fa fa-user-circle"></span></div>' +
                            '<div class="questions-counter" title="Questions counter">0</div>' +
                            '<div class="users-dropdown">' +
                                '<a href="#" class="trigger close-users">Close</a>' +
                                '<a href="#" class="trigger clear-users">Clear</a>' +
                                '<a href="#" class="trigger select-users">Assign</a>' +
                            '</div>' +
                        '</div>' +
                        '<div class="inner-header">' +
                            '<div class="title"><input type="text" placeholder="Questionnaire title..."></div>' +
                            '<div class="description"><input type="text" placeholder="Questionnaire description..."></div>' +
                        '</div>' +
                        '<div class="questions"></div>',
                    callbacks: {
                        show: () => {
                            questionsCounter = 0;
                            assignedUsers = [];
                            $('.slick-modal.create-questionnaire').find('.inner-header').find('.title').find('input').focus();
                        },
                        beforeConfirm: () => {
                            let $slick = $('.slick-modal.create-questionnaire');
                            let $title = $slick.find('.inner-header').find('.title').find('input');
                            let $description = $slick.find('.inner-header').find('.description').find('input');
                            let invalidQuestions = m.actions.getInvalidQuestions(m.actions.getQuestions());

                            if ( $slick.find('.question').length === 0 ) {
                                notifier.notify({
                                    type: 'error',
                                    title: 'Error',
                                    subtitle: 'No questions added. Make sure to add at least one question to the questionnaire.'
                                });
                                return false;
                            }
                            if ( assignedUsers.length === 0 ) {
                                notifier.notify({
                                    type: 'error',
                                    title: 'Error',
                                    subtitle: 'No users assigned. Make sure to assign at least one user to the questionnaire.'
                                });
                                return false;
                            }
                            if ( $title.val().length <= 5 || $title.val().length > 100 ) {
                                notifier.notify({
                                    type: 'error',
                                    title: 'Error',
                                    subtitle: 'Title does not match length. Make sure to provide a title longer than 5 symbols and shorter than 100 symbols.'
                                });
                                return false;
                            }
                            if ( $description.val().length <= 5 || $description.val().length > 200 ) {
                                notifier.notify({
                                    type: 'error',
                                    title: 'Error',
                                    subtitle: 'Description does not match length. Make sure to provide a description longer than 5 symbols and shorter than 200 symbols.'
                                });
                                return false;
                            }
                            if ( invalidQuestions.length > 0 ) {
                                notifier.notify({
                                    type: 'error',
                                    title: 'Error',
                                    subtitle: 'Some of the questions are not valid. Make sure that all questions have titles with length longer than 5 symbols and shorter than 200 symbols. Also make sure to select type for each question.',
                                    hideAfter: 7500
                                });
                                return false;
                            }
                            return true;
                        },
                        confirm: () => {
                            let $slick = $('.slick-modal.create-questionnaire');

                            ajax({
                                url: '/questionnaires/create',
                                data: {
                                    title: $slick.find('.inner-header').find('.title').find('input').val(),
                                    description: $slick.find('.inner-header').find('.description').find('input').val(),
                                    questions: JSON.stringify(m.actions.getQuestions()),
                                    assignedUsers: JSON.stringify(assignedUsers),
                                    token: $module.find('input[name="token"]').val()
                                },
                                callback: (err, res) => {
                                    console.log(err, res);
                                    if ( err || res && res.status === 'error' ) {

                                    }
                                    if ( res.status === 'success' ) {
                                        notifier.notify({
                                            type: 'success',
                                            title: 'Success',
                                            subtitle: res.message,
                                            callbacks: {
                                                hide: () => {
                                                    window.location.href = res.redirect || '/questionnaires';
                                                }
                                            }
                                        });
                                    }
                                    assignedUsers = [];
                                }
                            });
                        }
                    }
                });
            });

            m.events.onAddQuestion((e) => {
                e.preventDefault();
                let $slick = $('.slick-modal.create-questionnaire');
                questionsCounter++;
                m.renderers.addQuestion({index: questionsCounter}, $slick.find('.questions'));
                $slick.find('.questions-counter').text(questionsCounter);
                $slick.find('.questions-counter').addClass('active');
                setTimeout(() => {$slick.find('.question').last().find('.question-text').find('input').focus();}, 50);
                if ( ! $slick.find('.questions').hasClass('active') ) {
                    $slick.find('.questions').addClass('active');
                }
            });

            m.events.onRemoveQuestion((e) => {
                e.preventDefault();
                let $question = $(e.target).closest('.question');
                let $slick = $('.slick-modal.create-questionnaire');
                questionsCounter--;
                $question.remove();
                m.renderers.syncQuestionsIndexes();
                $slick.find('.questions-counter').text(questionsCounter);
                if ( questionsCounter === 0 ) {
                    $slick.find('.questions-counter').removeClass('active');
                    $slick.find('.questions').removeClass('active');
                }
            });

            m.events.onAssignUsers((e) => {
                e.preventDefault();
                let $slick = $('.slick-modal.create-questionnaire');
                $slick.find('.trigger.assign-bulk').removeClass('active');
                $slick.find('.trigger.assign-users').addClass('active');

                if ( users.length > 0 ) {
                    m.renderers.showUsersDropdown(users, assignedUsers, m.actions.isSelectedUser);
                } else {
                    ajax({
                        url: '/questionnaires/get-users',
                        data: {
                            role: 0,
                            token: $module.find('input[name="token"]').val()
                        },
                        callback: (err, res) => {
                            if ( err || res && res.status === 'error' ) {
                                return notifier.notify({
                                    type: 'error',
                                    title: 'Error',
                                    subtitle: err ? err.toString() : res.message
                                });
                            }
                            if ( res.status === 'success' ) {
                                users = res.data;
                                m.renderers.showUsersDropdown(res.data);
                            }
                        }
                    });
                }

            });

            m.events.onUserSelect((e) => {
                e.preventDefault();
                let $user = $(e.target);
                if ( $user.is('.selected') ) {
                    $user.removeClass('selected');
                    assignedUsers = _.filter(assignedUsers, (a) => {return a.id !== $user.data('id')});
                } else {
                    $user.addClass('selected');
                    assignedUsers.push({
                        id: $user.data('id'),
                        name: $user.find('.name').text(),
                        email: $user.data('email')
                    });
                    assignedUsers = _.uniq(assignedUsers, (a) => {return a.id});
                }
            });

            m.events.onUsersSelect((e) => {
                e.preventDefault();
                if ( assignedUsers.length === 0 ) {
                    return notifier.notify({
                        type: 'error',
                        title: 'Error',
                        subtitle: 'Make sure to select at least one user.'
                    });
                }

                $(e.target).addClass('active');
                let $slick = $('.slick-modal.create-questionnaire');
                let userNames = [];
                $slick.find('.users-dropdown').removeClass('active');
                $slick.find('.assigned-user').addClass('active');
                assignedUsers.map((a) => { userNames.push(a.name); });
                $slick.find('.assigned-user').attr('title', 'Assigned user'+(assignedUsers.length === 1 ? ' is ' : 's are ')+userNames.join(', '));
            });

            m.events.onAssignBulk((e) => {
                e.preventDefault();
                let $slick = $('.slick-modal.create-questionnaire');
                let $el = $(e.target);

                if ( $el.hasClass('active') ) {
                    $el.removeClass('active');
                    assignedUsers = [];
                } else {
                    $el.addClass('active');
                    $slick.find('.users-dropdown').removeClass('active');
                    $slick.find('.trigger.assign-users').removeClass('active');
                    $slick.find('.assigned-user').addClass('active');
                    $slick.find('.assigned-user').attr('title', 'All users assigned');
                    users.map((a) => {
                        assignedUsers.push({
                            id: a._id,
                            name: a.firstName+' '+a.lastName,
                            email: a.email
                        });
                    });
                    assignedUsers = _.uniq(assignedUsers, (a) => {return a.id});
                }
            });

            m.events.onUsersClear((e) => {
                e.preventDefault();
                let $slick = $('.slick-modal.create-questionnaire');
                assignedUsers = [];
                $slick.find('.user').removeClass('selected');
                $slick.find('.assigned-user').removeClass('active');
                $slick.find('.assigned-user').attr('title', 'No users assigned');
            });

            m.events.onUsersClose((e) => {
                e.preventDefault();
                $('.slick-modal.create-questionnaire').find('.users-dropdown').removeClass('active');
            });

            m.events.onSubmitQByUser((e) => {
                e.preventDefault();
                let $q = $(e.target).closest('.questionnaire');
                let answers = m.actions.getQAnswers($q);
                if ( ! m.actions.validateQ(settings.questionnaires.format, answers) ) {
                    return false;
                }

                m.actions.toggleQ($q, false);
                notifier.notifyAndConfirm({
                    type: 'warning',
                    title: 'Confirm action',
                    subtitle: 'Are you sure you want to submit this questionnaire? After submitting the questionnaire you cannot modify your answers.',
                    callbacks: {
                        onCancel: () => {
                            m.actions.toggleQ($q, true);
                        },
                        onConfirm: () => {
                            ajax({
                                url: '/questionnaires/complete-questionnaire',
                                data: {
                                    assigneeID: $q.data('assignee-id'),
                                    answers: JSON.stringify(answers),
                                    token: $module.find('[name="token"]').val()
                                },
                                callback: (err, res) => {
                                    if ( err || res && res.status === 'error' ) {
                                        return notifier.notify({
                                            type: 'error',
                                            title: 'Error',
                                            subtitle: err ? err.toString() : res.message
                                        });
                                    }
                                    if ( res && res.status === 'success' ) {
                                        m.actions.toggleQ($q, true);
                                        $q.find('.questionnaire-body').slideUp(50, () => {
                                            $q.remove();
                                            notifier.notify({
                                                type: 'success',
                                                title: 'Success',
                                                subtitle: res.message,
                                                callbacks: {
                                                    hide: () => {
                                                        location.href = res.redirect || '/questionnaires';
                                                    }
                                                }
                                            });
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            });

            m.events.sortAsc((e) => {
                e.preventDefault();
                let $el = $(e.target);
                $module.find('.trigger.sort-asc').removeClass('selected');
                $module.find('.trigger.sort-desc').removeClass('selected');
                $el.addClass('selected');
                let target = $el.closest('[data-sort]').data('sort');
                let type = $el.closest('[data-sort-type]').data('sort-type');
                m.renderers.dataSort(type, 'asc', '.'+target, $module.find('.all-questionnaires').find('.questionnaire'), $module.find('.all-questionnaires').find('.questionnaires-table'));
            });
            m.events.sortDesc((e) => {
                e.preventDefault();
                let $el = $(e.target);
                $module.find('.trigger.sort-asc').removeClass('selected');
                $module.find('.trigger.sort-desc').removeClass('selected');
                $el.addClass('selected');
                let target = $el.closest('[data-sort]').data('sort');
                let type = $el.closest('[data-sort-type]').data('sort-type');
                m.renderers.dataSort(type, 'desc', '.'+target, $module.find('.all-questionnaires').find('.questionnaire'), $module.find('.all-questionnaires').find('.questionnaires-table'));
            });

            m.events.onLimitSelect((e) => {
                $(e.target).closest('form').submit();
            });

            m.events.onFilterSelect((e) => {
                $(e.target).closest('form').submit();
            });

            m.events.onSearch((e) => {
                e.preventDefault();
                $(e.target).closest('form').submit();
            });

            m.events.onClear((e) => {
                e.preventDefault();
                $(e.target).closest('form').submit();
            });

            m.events.onSelectAll((e) => {
                let $el = $(e.target);
                let $q = $module.find('.questionnaires-table').find('.questionnaire');
                console.log($q);
                if ( $el.is(':checked') ) {
                    $q.addClass('selected');
                    $q.find('[type="checkbox"]').prop('checked', true);
                } else {
                    $q.removeClass('selected');
                    $q.find('[type="checkbox"]').prop('checked', false);
                }
            });

            m.events.onSelectQ((e) => {
                let $el = $(e.target);
                let $q = $el.closest('.questionnaire');
                if ( $el.is(':checked') ) {
                    $q.addClass('selected');
                } else {
                    $q.removeClass('selected');
                }
            });

            m.events.onViewQ((e) => {
                e.preventDefault();
                let $q = $(e.target).closest('.questionnaire');
                let q;

                sequence()
                    .chain((seq) => {
                        ajax({
                            url: '/questionnaires/get-questionnaire',
                            data: {
                                id: $q.data('id'),
                                token: $module.find('input[name="token"]').val()
                            },
                            callback: (err, res) => {
                                q = err ? {} : res.data;
                                seq.resolve();
                            }
                        });
                    })
                    .chain((seq) => {
                        slickModal({
                            selector: 'view-questionnaire',
                            title: 'View questionnaire',
                            fullscreen: true,
                            easyClose: true,
                            content: '',
                            callbacks: {
                                show: () => {
                                    let $slick = $('.slick-modal.view-questionnaire');
                                    let html = `<div class="questionnaire opened" data-id="${q._id}">
                                        <div class="questionnaire-header">
                                            <h5 class="title">${q.title}</h5>
                                            <p class="subtitle">${q.description}</p>
                                            <span class="status ${q.status}" title="Questionnaire status">${utils.capitalize(q.status)}</span>
                                        </div>
                                        <div class="questionnaire-body"><div class="answers">`;
                                    if ( q.status === settings.questionnaires.statuses.completed ) {
                                        q.answers.forEach((a, i) => {
                                            html += `<div class="answer" data-type="${a.type}" data-index="${i + 1}">
                                            <div class="text">
                                                <span class="question-index">${i + 1}.</span> ${q.questions[i].text}
                                            </div>`;

                                            if ( a.type === 'text' ) {
                                                html += `<input type="text" placeholder="Insert answer..." readonly value="${a.text}">`;
                                            }
                                            if ( a.type === 'textarea' ) {
                                                html += `<textarea placeholder="Insert answer..." readonly>${a.text}</textarea>`;
                                            }
                                            if ( a.type === 'range' ) {
                                                html += `<div class="range-counter" title="Selected value">${a.range}</div>`;
                                            }
                                            if ( a.type === 'text-range' ) {
                                                html += `<div class="range-counter" title="Selected value">${a.range}</div>
                                            <input type="text" placeholder="Insert answer..." readonly value="${a.text}">`;
                                            }
                                            html += `</div>`;
                                        });
                                    } else if ( q.status === settings.questionnaires.statuses.assigned ) {
                                        q.questions.forEach((a, i) => {
                                            html += `<div class="answer" data-type="${a.type}" data-index="${i + 1}">
                                            <div class="text">
                                                <span class="question-index">${i + 1}.</span> ${a.text}
                                            </div>
                                            <p>Answer not submitted yet...</p>`;
                                            html += `</div>`;
                                        });
                                    }

                                    html += `</div></div>`;
                                    $slick.find('.modal-content').html(html);
                                    seq.resolve();
                                }
                            }
                        });
                    })
                    .execute();
            });

            m.events.onBulkAction((e) => {
                e.preventDefault();
                let action = $module.find('[name="bulk-action"]').find('option:selected').val();
                if ( !action || action === '' ) {
                    return notifier.notify({
                        type: 'error',
                        title: 'Error',
                        subtitle: 'Invalid bulk action. Make sure to select a bulk action first.'
                    });
                }
                let ids = [];
                $module.find('.questionnaires-table').find('.questionnaire').each((i, e) => {
                     let $el = $(e);
                     if ( $el.find('.questionnaire-selector').find('[type="checkbox"]').prop('checked') ) {
                         ids.push($el.data('id'));
                     }
                });
                if ( ids.length === 0 ) {
                    return notifier.notify({
                        type: 'error',
                        title: 'Error',
                        subtitle: 'No questionnaires selected. Make sure to select at least one questionnaire first.'
                    });
                }

                if ( action === 'delete' ) {
                    ajax({
                        url: '/questionnaires/delete',
                        data: {
                            ids: JSON.stringify(ids),
                            token: $module.find('input[name="token"]').val()
                        },
                        callback: (err, res) => {
                            if ( err ) {
                                return notifier.notify({
                                    type: 'error',
                                    title: 'Error',
                                    message: 'Unable to delete selected questionnaire(s). Please refresh the page and try again.'
                                });
                            }
                            if ( res.status === 'error' ) {
                                return notifier.notify({
                                    type: 'error',
                                    title: 'Error',
                                    subtitle: res.message
                                });
                            }
                            if ( res.status === 'success' ) {
                                notifier.notify({
                                    type: 'success',
                                    title: 'Success',
                                    subtitle: res.message,
                                    callbacks: {
                                        hide: () => {
                                            window.location.href = res.redirect || '/questionnaires';
                                        }
                                    }
                                });
                            }
                        }
                    });
                } else if ( action === 'export' ) {
                    ajax({
                        url: '/questionnaires/export',
                        data: {
                            ids: JSON.stringify(ids),
                            token: $module.find('input[name="token"]').val()
                        },
                        callback: (err, res) => {
                            if ( err ) {
                                return notifier.notify({
                                    type: 'error',
                                    title: 'Error',
                                    message: 'Unable to export selected questionnaire(s). Please refresh the page and try again.'
                                });
                            }
                            if ( res.status === 'error' ) {
                                return notifier.notify({
                                    type: 'error',
                                    title: 'Error',
                                    subtitle: res.message
                                });
                            }
                            console.log(res);
                            if ( res.status === 'success' ) {
                                let rows = [['Title', 'Assignee Email', 'Question', 'Answer Text', 'Answer Score']];
                                res.data.map((q) => {
                                    if ( q.status === settings.questionnaires.statuses.completed ) {
                                        q.answers.forEach((a, i) => {
                                            let cols = i > 0 ? ['', ''] : [q.title, q.assigneeEmail];
                                            cols.push(q.questions[i].text);
                                            cols.push(a.text ? a.text : '');
                                            cols.push(a.range ? a.range : '');
                                            rows.push(cols);
                                        });
                                    } else if ( q.status === settings.questionnaires.statuses.assigned ) {
                                        q.questions.forEach((a, i) => {
                                            let cols = i > 0 ? ['', ''] : [q.title, q.assigneeEmail];
                                            cols.push(q.questions[i].text);
                                            rows.push(cols);
                                        });
                                    }
                                });
                                utils.exportToCsv('questionnaires.csv', rows);
                                notifier.notify({
                                    type: 'success',
                                    title: 'Success',
                                    subtitle: res.message
                                });
                            }
                        }
                    });
                }

            });
        });

    module.callNode('actions', 'init');
});
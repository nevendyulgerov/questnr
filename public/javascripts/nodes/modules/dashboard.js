/* globals questnr */
/**
 * Module: Dashboard
 */

questnr.addNode("modules", "dashboard", ($module, module) => {
    "use strict";
    let ajax = questnr.getNode('core', 'ajax');
    let store = storage(questnr.getNode('core', 'storeKey')());

    module.configure('actions')
        .node('init', () => {
            let settings = store.getData();

            if ( settings.user.role > 0 ) {
                let assignedCounter = 0;
                let completedCounter = 0;
                return sequence()
                    .chain((seq) => {
                        ajax({
                            url: '/dashboard/questionnaires/by-status',
                            data: {
                                token: $module.find('input[name="token"]').val(),
                                status: settings.questionnaires.statuses.completed
                            },
                            callback: (err, res) => {
                                completedCounter = err || res && res.status === 'error' ? 0 : res.data.length;
                                seq.resolve();
                            }
                        });
                    })
                    .chain((seq) => {
                        ajax({
                            url: '/dashboard/questionnaires/by-status',
                            data: {
                                token: $module.find('input[name="token"]').val(),
                                status: settings.questionnaires.statuses.assigned
                            },
                            callback: (err, res) => {
                                assignedCounter = err || res && res.status === 'error' ? 0 : res.data.length;
                                seq.resolve();
                            }
                        });
                    })
                    .chain((seq) => {

                        console.log(assignedCounter, completedCounter);

                        let $widget = $module.find('.statistics[data-statistics="users"]');
                        google.charts.load('current', {'packages':['corechart']});
                        google.charts.setOnLoadCallback(drawChart);

                        console.log($widget);

                        function drawChart() {
                            console.log('draw chart');
                            let data = new google.visualization.DataTable();
                            data.addColumn('string', 'Questionnaires by Status');
                            data.addColumn('number', 'Amount');
                            data.addRows([
                                ['Assigned', assignedCounter],
                                ['Completed', completedCounter]
                            ]);
                            let options = {
                                'height': 300
                            };
                            let chart = new google.visualization.PieChart(document.getElementById('chart-data'));
                            chart.draw(data, options);
                            $widget.addClass('active');
                        }
                        seq.resolve();
                    })
                    .execute();
            }
            ajax({
                url: '/dashboard/questionnaires',
                data: {
                    token: $module.find('input[name="token"]').val()
                },
                callback: (err, res) => {
                    if ( res && res.status === "success" ) {
                        $module.find('[data-widget="questionnaires"]').attr('data-has-items', true);
                        $module.find('[data-widget="questionnaires"]').find('.counter').text(res.data.length);
                    }
                }
            });
        });

    module.callNode('actions', 'init');
});
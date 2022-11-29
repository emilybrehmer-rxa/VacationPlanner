var query;

(async () => {
  let quarter = await setupDate();
  let projectCode = 'billable'
  let select = ['goalhoursactual', 'qtrdayselapsed', 'harvesthoursbilled', 'goalhoursactuallegacy', 'qtrworkdays']
  let where = [`harvestquarter= ${quarter}`, `harvestprojectcode= ${projectCode}`]
  query = `/data/v1/harvest?fields=${select.join()}
                  &filter=${where.join()}
  `;
})();


function calculate(keyPressed){
  calculateHours(keyPressed);
}

function calculateHours(days){
  var qtrdayselapsed =  [];
  var goalhoursactual = [];
  var harvesthoursbilled = [];
  var goalhoursactuallegacy = [];
  var qtrworkdays = [];
  
  domo.get(query)
  .then(function(data){
    
    data.forEach(entry => {
      qtrdayselapsed.push(entry.qtrdayselapsed);
      goalhoursactual.push(entry.goalhoursactual);
      harvesthoursbilled.push(entry.harvesthoursbilled);
      goalhoursactuallegacy.push(entry.goalhoursactuallegacy);
      qtrworkdays.push(entry.qtrworkdays);
    })
    
    var maxQtrDaysElapsed = maxValue(qtrdayselapsed);
    var sumHarvestHoursBilled = sumValue(harvesthoursbilled);
    var maxQtrWorkDays = maxValue(qtrworkdays);
    var sumGoalHoursActualLegacy = sumValue(goalhoursactuallegacy);

    var adjDaysLeftInQtr = (maxQtrWorkDays - maxQtrDaysElapsed - days);
    document.getElementById("adj-days-left").innerHTML = adjDaysLeftInQtr.toFixed(0);  
    
    var totalHoursToHitGoal = sumGoalHoursActualLegacy - sumHarvestHoursBilled
    document.getElementById("total-hours-to-hit-goal").innerHTML = totalHoursToHitGoal.toFixed(0);

    var avgHoursToHitGoal = (sumGoalHoursActualLegacy - sumHarvestHoursBilled) / (adjDaysLeftInQtr)
    document.getElementById("new-avg-hours-needed").innerHTML = avgHoursToHitGoal.toFixed(1);
  });
}

function maxValue(arr){
  var max = 0;
  arr.forEach(entry => {
    if(entry >= max){
      max=entry;
    }
  });

  return max;
}

function sumValue(arr){
  var sum = 0;
  arr.forEach(entry => {
    if(entry != null){
      sum += entry;
    }
  });

  return sum;
}
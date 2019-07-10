Template.comisionablesstats.helpers({

    getTitle: function(){
      Session.set("myyear", this.year);
      return "Comisionables"+this.year
    },

    comis: function(){
      return Comisionables.find({}, {sort:{name: 1}});
    },

    thecomis: function(){
      var currentYear = moment().format('YYYY');
      var start = moment("01-01-"+this.year+"", "MM-DD-YYYY").toDate();
      var nextYear = parseInt(this.year)+1;
      var end = moment("01-01-"+nextYear+"", "MM-DD-YYYY").toDate();
  
      // var theComis = Bookings.find({"fechareco": {$gte: start, $lt: end}, "isComissioned": true}, {fields:  {comisionPerson: 1, comisionId: 1, comisionEuros: 1, comisionDate: 1, fechareco: 1}}).fetch();
  
      // console.log("sdg");
      // console.log(end);
  
      var comisGroups = Bookings.find({
                  "fechareco": {$gte: start, $lt: end}, 
                  "isComissioned": true
              }, 
              {
                  fields:  {
                      "comisionPerson": 1, 
                      "comisionId": 1, 
                      "comisionEuros": 1, 
                      "comisionDate": 1, 
                      "fechareco": 1
                  }
              }).fetch();

              console.log("comisGroupsHelpèr");
              console.log(comisGroups);
      var mycomisGroups = _.groupBy(comisGroups, "comisionPerson");
      var mycomisGroupsArr = Object.keys(mycomisGroups).map((key) => {
        return {
          name: key,
        }
      });
      return mycomisGroupsArr;
    },

    getMyColor: function(indexing){
      var mycolor = d3.scaleOrdinal(d3.schemeCategory10);
      var mycolor = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"]
      var thecolor;
      if(indexing < 20) {
        thecolor = mycolor[indexing];
      } else {
        thecolor = mycolor[parseInt(indexing%20)];
      }
      return thecolor;
    }
});

Template.comisionablesstats.onRendered(function () {

  var mytemplate = this;
  var theyear = mytemplate.data.year;
  var maximumY = 0;
  console.log("render");
  console.log(mytemplate.data.year);

  var controller = Router.current();

  function getComisCurrentYear () {



    function monthlyIncome(myComi) {
      var myArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (var i = 0; i < myComi.length; i++){
        var theMonth = moment(myComi[i].fechareco).format("M");
        if(myComi[i].comisionEuros) {
          myArr[theMonth] = myArr[theMonth] + myComi[i].comisionEuros;
        }
      }

      var myArrDef = [];
      
      for(var i = 0; i<14;i++){
        if(i == 0 || i == 13){
          var singleComiObj = {
            mes: i,
            price: 0
          }
        } else {
          var singleComiObj = {
            mes: i,
            price: parseFloat(myArr[i]).toFixed(2)
          }
  
          if(maximumY < parseFloat(myArr[i])) {
            maximumY = parseFloat(myArr[i]);
          }
        }
        myArrDef.push(singleComiObj);
      }

      return myArrDef;
    }

    var currentYear = moment().format('YYYY');
    var start = moment("01-01-"+theyear+"", "MM-DD-YYYY").toDate();
    var nextYear = parseInt(theyear)+1;
    var end = moment("01-01-"+nextYear+"", "MM-DD-YYYY").toDate();



    var comisGroups = Bookings.find({
                "fechareco": {$gte: start, $lt: end}, 
                "isComissioned": true
            }, 
            {
                fields:  {
                    "comisionPerson": 1, 
                    "comisionId": 1, 
                    "comisionEuros": 1, 
                    "comisionDate": 1, 
                    "fechareco": 1
                }
            }).fetch();

    var mycomisGroups = _.groupBy(comisGroups, "comisionPerson");
    var mycomisGroupsArr = Object.keys(mycomisGroups).map((key) => {
      return {
        name: key,
        values: monthlyIncome(mycomisGroups[key])
      }
    });

    return mycomisGroupsArr;
}

  function giveMeColor(indexing){
    var mycolor = d3.scaleOrdinal(d3.schemeCategory10);
    var mycolor = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"]
    var thecolor;
    if(indexing < 20) {
      thecolor = mycolor[indexing];
    } else {
      thecolor = mycolor[parseInt(indexing%20)];
    }
    return thecolor;
  }

  this.autorun(function() {
    var params = controller.getParams() // Reactive

    // Clear up your drag interface here
    var data = getComisCurrentYear();

    // console.log("data");
    // console.log(data);
  
    var width = 600;
    var height = 380;
    var margin = 50;
    var duration = 250;
    
    var lineOpacity = "0.5";
    var lineOpacityHover = "1";
    var otherLinesOpacityHover = "0.1";
    var lineStroke = "2.5px";
    var lineStrokeHover = "3.5px";
    
    var circleOpacity = '1';
    var circleOpacityOnLineHover = "0.25"
    var circleRadius = 4;
    var circleRadiusHover = 12;
  
    function getMyMonth(numMonth){
      return moment(numMonth, 'MM').format('MMM'); 
    }
    
    
    /* Format Data */
    var parseDate = d3.timeParse("%M");
    data.forEach(function(d) { 
      d.values.forEach(function(d, i) {
        d.mes = i;
        d.price = +d.price;  
      });
    });
    
    
    /* Scale */
    var xScale = d3.scaleLinear()
      .domain([0, 13])
      .range([0, width-margin]);
    
    var yScale = d3.scaleLinear()
      .domain([0, maximumY])
      .range([height-margin, 0]);
    
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    
    /* Add SVG */
    var svg = d3.select("#chart").append("svg")
      .attr("width", (width+margin)+"px")
      .attr("height", (height+margin)+"px")
      .append('g')
      .attr("transform", `translate(${margin}, ${margin})`);
    
    
    /* Add line into SVG */
    var line = d3.line()
      .x(d => xScale(d.mes))
      .y(d => yScale(d.price))
      .curve(d3.curveMonotoneX);
    
    let lines = svg.append('g')
      .attr('class', 'lines');
    
    lines.selectAll('.line-group')
      .data(data).enter()
      .append('g')
      .attr('class', 'line-group')
      .attr('data-name', function(d){
        return d.name
      })  
      .on("mouseover", function(d, i) {
          svg.append("text")
            .attr("class", "title-text")
            .style("fill", giveMeColor(i))        
            .text(d.name)
            .attr("text-anchor", "middle")
            .attr("x", (width-margin)/2)
            .attr("y", 5);
        })
      .on("mouseout", function(d) {
          svg.select(".title-text").remove();
        })
      .append('path')
      .attr('class', 'line')  
      .attr('d', function(d) {
        return line(d.values)
      })
      .style('stroke', (d, i) => giveMeColor(i))
      .style('fill', (d, i) => giveMeColor(i))
      .style('opacity', lineOpacity)
      .on("mouseover", function(d) {
          d3.selectAll('.line')
              .style('opacity', otherLinesOpacityHover);
          d3.selectAll('.circle')
              .style('opacity', circleOpacityOnLineHover);
          d3.select(this)
            .style('opacity', lineOpacityHover)
            .style("stroke-width", lineStrokeHover)
            .style("cursor", "pointer");
        })
      .on("mouseout", function(d) {
          d3.selectAll(".line")
              .style('opacity', lineOpacity);
          d3.selectAll('.circle')
              .style('opacity', circleOpacity);
          d3.select(this)
            .style("stroke-width", lineStroke)
            .style("cursor", "none");
        });
    
    
    /* Add circles in the line */
    lines.selectAll("circle-group")
      .data(data).enter()
      .append("g")
      .attr('class', 'thecircles')
      .attr('data-name', function(d){
        return d.name
      })   
      .style("fill", (d, i) => giveMeColor(i))
      .selectAll("circle")
      .data(d => d.values).enter()
      .append("g")
      .attr("class", "circle")  
      .on("mouseover", function(d) {
          d3.select(this)     
            .style("cursor", "pointer")
            .append("text")
            .attr("class", "text")
            .text(`${d.price}€`)
            .attr("x", d => xScale(d.mes) - 12)
            .attr("y", d => yScale(d.price) - 20);
        })
      .on("mouseout", function(d) {
          d3.select(this)
            .style("cursor", "none")  
            .transition()
            .duration(duration)
            .selectAll(".text").remove();
        })
      .append("circle")
      .attr("cx", function(d){
        return xScale(parseInt(d.mes))
      })
      .attr("cy", d => yScale(d.price))
      .attr("r", circleRadius)
      .attr("data-mes", function(d){
          return d.mes
      })
      .style('opacity', circleOpacity)
      .on("mouseover", function(d) {
            d3.select(this)
              .transition()
              .duration(duration)
              .attr("r", circleRadiusHover);
          })
        .on("mouseout", function(d) {
            d3.select(this) 
              .transition()
              .duration(duration)
              .attr("r", circleRadius);  
          });
    
    
    /* Add Axis into SVG */
    var xAxis = d3.axisBottom(xScale).ticks(5);
    var yAxis = d3.axisLeft(yScale).ticks(5);
    
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height-margin})`)
      .call(xAxis);
    
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append('text')
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
      .text("€ comisionado");
  
    svg.select('.x.axis').selectAll("text").text(function(d){
      if(d == 0){
        return "0";
      } else {
        return getMyMonth(d);
      }
    });
  });  

});


Template.comisionablesstats.events({
  'click .all': function(e) {
    $(e.currentTarget).parent().find("input[type='checkbox']").each(function(i){
      $(this).prop("checked", true);
      $(".line-group[data-name='"+$(this).attr("data-name")+"']").css("visibility", "visible");
      $(".thecircles[data-name='"+$(this).attr("data-name")+"']").css("visibility", "visible");
    });
  },

  'click .none': function(e){ 
    $(e.currentTarget).parent().find("input[type='checkbox']").each(function(i){
      $(this).prop("checked", false);
      $(".line-group[data-name='"+$(this).attr("data-name")+"']").css("visibility", "hidden");
      $(".thecircles[data-name='"+$(this).attr("data-name")+"']").css("visibility", "hidden");
    });
  },

  'change .comifilter': function(e){
    if($(e.currentTarget).is(':checked')) {
      $(".line-group[data-name='"+$(e.currentTarget).attr("data-name")+"']").css("visibility", "visible");
      $(".thecircles[data-name='"+$(e.currentTarget).attr("data-name")+"']").css("visibility", "visible");
    } else {
      $(".line-group[data-name='"+$(e.currentTarget).attr("data-name")+"']").css("visibility", "hidden");
      $(".thecircles[data-name='"+$(e.currentTarget).attr("data-name")+"']").css("visibility", "hidden");
    }
  }

})
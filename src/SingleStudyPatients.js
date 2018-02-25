import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import * as d3 from 'd3';

export default class SingleStudyPatients extends Component {

    constructor() {
        super();
        this.state = {
          //singlestudydata: [],
          //patientdata: [],
          showSVG: false
        }
    }   
    

    aggregatedata(a) {

      var newCols={};
      
      a.forEach(s=>{
        //console.log(s);
        if(!newCols[s.patientId]){
          newCols[s.patientId]={
            patientId: s.patientId
            
          }
        }
        
        var x=s.clinicalAttributeId;
        
        newCols[s.patientId][x] = s.value;
      
        
      });
      
      return newCols;

  }

  

    dovis(patientsList, a, clinicalData){

   
      console.log(patientsList);


      var r;
      
      if(clinicalData){
        r=  this.aggregatedata(clinicalData);
        console.log(r);
        if(r) {
          console.log(r["P01"]);
        }
      }



      let data={};

      a.forEach(function(s){

        
        if(!data[s.patientId + s.startNumberOfDaysSinceDiagnosis + s.eventType]){

                  if(s.eventType!='TREATMENT'){
                      data[s.patientId + s.startNumberOfDaysSinceDiagnosis + s.eventType]={
                        patientId: s.patientId,
                        days: s.startNumberOfDaysSinceDiagnosis,
                        days2: s.startNumberOfDaysSinceDiagnosis,
                        eventType: s.eventType,
                        Age: r[s.patientId].AGE,
                        Sex: r[s.patientId].SEX,
                        Status: r[s.patientId].OS_STATUS
                      }
                }  

                else{
                  data[s.patientId + s.startNumberOfDaysSinceDiagnosis + s.eventType]={
                    patientId: s.patientId,
                    days: s.startNumberOfDaysSinceDiagnosis,
                    days2: s.endNumberOfDaysSinceDiagnosis,
                    eventType: s.eventType,
                    Age: r[s.patientId].AGE,
                    Sex: r[s.patientId].SEX,
                    Status: r[s.patientId].OS_STATUS
                  }

                    
                }


                }
                
      });
      
      data=Object.values(data);

      //data=Object.values(data);

      console.log(data);



      let aggdata={};

      patientsList.forEach(function(k){
      
      var  pi=k.patientId,
      
      xd=data.filter(s=>s.patientId==pi),
      x1=xd.map(s=>s.days),
      m=Math.max(...x1);
      
 
             if(!aggdata[pi]){
      
                        aggdata[pi]={
                          patientId: pi,
                          daysSurvived: m,
                          
                          Sex: xd[0].Sex
                          
                        }
                      }
      
        }
      )


    aggdata=Object.values(aggdata);



    var c=aggdata.map(s=>s.daysSurvived);


    var gen=aggdata.map(s=>s.Sex);



    var cm=Math.max(...c);



  var cmf=Math.ceil(cm/100);


  let bin={};

  for(let i=1; i<=cmf; i++){
  
  var count=0, count_m=0, count_f=0;
  
  for(let j=0; j<c.length; j++){
    
      if(c[j]/(i*100)>=1){
        count++;
        if(gen[j]=="Male"){
          count_m++;
        }
      
        else{
          count_f++; 
        }
      }
    
      
    }
  
  
    if(!bin[i]){
      bin[i]={
        numDays:  i*100,
        countP: count,
        count_m: count_m,
        count_f: count_f
    }
  
  }
}

    bin=Object.values(bin);

    var cValue = function(d) { return d.eventType;},
    color = d3.scaleOrdinal(d3.schemeCategory20); //d3.scale.category10();
      
      //var svg = d3.select("svg");
      const svg = d3.select(this.refs.anchor);
      var margin = {top: 20, right: 300, bottom: 30, left: 40};
      var width = 900-margin.left-margin.right; //+svg.attr("width") - margin.this.left - margin.this.right,
      var height = 900-margin.top-margin.bottom; //+svg.attr("height") - margin.this.top - margin.this.bottom;
      

     // var x = d3.scaleBand().rangeRound([0, width]),//.padding(0.1),
       //   y = d3.scaleLinear().rangeRound([height, 0]);
      

      var x = d3.scaleLinear().rangeRound([0, width+200]);//.padding(0.1),
      var y = d3.scaleBand().rangeRound([height, 0]);
        
        
      var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      var tooltip = g.append('text');
//      .style("position", "absolute")
//      .style("z-index", "10")
//      .style("visibility", "hidden");;

      
      var xAxis = d3.axisBottom(x);
      var yAxis = d3.axisLeft(y); //.ticks(10, "%");
        

      

      var test;

      var flag=1;

      if(flag){
        test=data.map(function(d) { return d.patientId; }).sort();
      }



//button

        d3.select("#btn")
        .on("click", function() {
           
        if(flag){

          test=data.sort(function(a, b){
            return a["Age"]-b["Age"];
          }).map(function(d) { return d.patientId; });

          flag=0;

        }
        else{

          test=data.map(function(d) { return d.patientId; }).sort();

          flag=1;
        }
        //  console.log(test);


          //change axis

         // x.domain([""].concat(test).concat(["", "", ""]));
         // y.domain([0, d3.max(data, function(d) { return d.days; })]);

         


          x.domain([0, d3.max(data, function(d) { 
            //console.log(d); 
            return d.days; 
          
          })]);



         y.domain([""].concat(test).concat(["", "", ""]));


          g//.append("g")
          //.attr("class", "axis axis--x")
          //.attr("transform", "translate(-11," + height + ")")
          .call(xAxis);
      // Y AXIS
         g.append("g")
          //.attr("class", "axis axis--y")
          .call(yAxis);
        //.append("text")
         // .attr("transform", "rotate(-90)")
         // .attr("y", 6)
         // .attr("dy", "0.71em")
         // .attr("text-anchor", "end")
         // .text("event");
    


          g
          .selectAll("circle")
          .transition().duration(1500)
          
            .attr("cy", function(d) { 

              return y(d.patientId); 
            })
            .attr("cx", function(d) { 
              
              //return x(d.days); 
            
              //console.log(d.days);
              return x(d.days); 

            });
//transition for line


        g
          .selectAll("line")
          .transition().duration(1500)
           .attr("x1", function(d){
            console.log(d);
            return x(d.days);
          })   
           .attr("y1", function(d){return y(d.patientId)})      // y position of the first end of the line
           .attr("x2", function(d){return x(d.days2)})      // x position of the second end of the line
           .attr("y2",function(d){return y(d.patientId)}); 


            //end transition for line


        });


//end button



        x.domain([0, d3.max(data, function(d) { 
          //console.log(d); 
          return d.days; 
        
        })]);



       y.domain([""].concat(test).concat(["", "", ""]));

       

      
        // Add Axes
        // X AXIS
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(-11," + height + ")")
            .call(xAxis);
        // Y AXIS
        g.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("event");
      

        g.append("text")             
            .attr("transform",
                  "translate(" + (width/2) + " ," + 
                                 (height + margin.top + 9) + ")")
            .style("text-anchor", "middle")
            .text("Timeline");
            
        
            ///table





            //BAR chart // SVG2


          var xbar = d3.scaleBand()
                  .range([0, width+200])
                  .padding(0.3);
          var ybar = d3.scaleLinear()
                  .range([height, 0]);

         // xbar.domain(bin.map(function(d) { return d.numDays; }));
        //  ybar.domain([0, d3.max(bin, function(d) { return d.countP; })]);




          const svg2 = d3.select(this.refs.anchor2);

          var g2 = svg2.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



          var xAxisBar = d3.axisBottom(xbar);
          var yAxisBar = d3.axisLeft(ybar); 






  var z = d3.scaleOrdinal()
    //.range(["#e68201", "#e66101"]);
    //.range(["#e66101", "#6b486b"]);
    .range(["#d8b365", "#5ab4ac"]);

  var dataIntermediate=bin;


  var keys = ["count_m", "count_f"];

//bin.sort(function(a, b) { return b.countP - a.countP; });

  xbar.domain(bin.map(function(d) { return d.numDays; }));
  ybar.domain([0, d3.max(bin, function(d) { return d.countP; })]).nice();
  //z.domain(keys);


  var tooltip2 = g2.append('text');

    g2
    .selectAll(".bar")
    .data(d3.stack().keys(keys)(bin))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { //console.log(d.data); 
        return xbar(d.data.numDays); })
      .attr("y", function(d) { //console.log(d[1]); 
        return ybar(d[1]); })
      .attr("height", function(d) { return ybar(d[0]) - ybar(d[1]); })
      .attr("width", 13)

      .on("mouseover", function(d) {
        tooltip2.raise();
        return tooltip2.style("visibility", "visible").style("z-index", -2).style("position", "absolute").text( (-1)*(d[0]-d[1]) );
      })
      .on("mousemove", function(d){
        return tooltip2.attr("x", xbar(d.data.numDays)+12).attr("y", ybar(d[1])-8).attr("fill", "black").attr("dy", "1em");
      })
      .on("mouseout", function(d){
        return tooltip2.style("visibility", "hidden");
      })



      //axis and legends


    g2.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xbar))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-0.5em")
      .attr("transform", "rotate(-90)");



    g2.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(ybar).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", ybar(ybar.ticks().pop()) + 0.5)
      .attr("dy", "0.3em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("# of Patients");

    var legend = g2.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.25em")
      .text(function(d) { 
        if(d=="count_m")
        return "Male"; //d; 
        else
        return "Female";
      });




            //end bar chart
        
           var table = d3.select("body").append("table")
                .attr("style", "margin-left: 250px"),
                thead = table.append("thead"),
                tbody = table.append("tbody");

          var columns=["PatientID", "Days", "Gender", "Age", "Status"];




    thead.append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text(function(column) { return column; });



          //end table



            
        g.selectAll(".bar")
          .data(data)
          .enter().append("circle")
            .attr("class", "bar")
            .attr("cx", function(d) {
              //console.log(d);
              //return x(d.patientId); 

              return x(d.days); 
            })
            .attr("cy", function(d) { 

              return y(d.patientId); 
            })
            .attr('r', 3)
            .style("fill", function(d) { return color(cValue(d));})
            .on("mouseover", function(d) {
              return tooltip.style("visibility", "visible").text(d.patientId + ", " + d.days+ " days, " + d.eventType + " age " + d.Age + ", " + d.Sex );
            })
            .on("mousemove", function(d){
              return tooltip.attr("x", (x(d.days)+5)).attr("y", y(d.patientId)).attr("fill", "DarkGreen").attr("dy", "0.6em");
            })
            .on("mouseout", function(d){
              return tooltip.style("visibility", "hidden");
            })
            .on("click", function(d, i){
             

              tbody.selectAll("tr").remove();
              tbody.selectAll("td").remove();


              var cells=tbody.append("tr");
              
              var data1 = [];

              //d.forEach(function(s){


              data1.push(d.patientId);
              data1.push(d.days);
              data1.push(d.Sex);
              data1.push(d.Age);	

              data1.push(d.Status);

              //});


            console.log(data1[0]);  
            tbody.append("tr")
                .selectAll("td")
                .data(data1)
                .enter()
                .append("td")
                .text(function(column) { return column; });

                console.log(tbody.selectAll("td"));
                
              
              
              }); //onclick end
          
              

              var line = d3.line()
                      .x(function(d) {
                        //console.log(d.days); 
                        //return x(d.startNumberOfDaysSinceDiagnosis); 

                        return x(d.days); 

                      })
                      .y(function(d) { 

                       // console.log(d.endNumberOfDaysSinceDiagnosis); 
                        return 800; 
                      });



              g.selectAll("line")
              .data(data)
             // .data(linedata)
              .enter().append("line")

             // .data(a.filter(d2 => (d2.eventType=='TREATMENT')))

             .filter(function(d) { return d.eventType=='TREATMENT' })
                //.attr("class", "line")
              //  .attr("d", line);
             // .style("stroke", "black")
             .style("stroke", function(d) { return color(cValue(d));})

             .style("stroke-width", "4.5")


              .attr("x1", function(d){
                console.log(d);
                //return x(d.startNumberOfDaysSinceDiagnosis);
                return x(d.days);
              })     // x position of the first end of the line
              .attr("y1", function(d){return y(d.patientId)})      // y position of the first end of the line
              .attr("x2", function(d){return x(d.days2)})      // x position of the second end of the line
              .attr("y2",function(d){return y(d.patientId)}); 


              //end lines




    }

    //end of dovis




//get data for visualization

    visdata(a) {
      //var newCols={};
      var allData = [];
      var allPromises = [];

      var clinicalData = [];

      //var allPromisesClinical = [];
        
      a.forEach(s=>{
        //axios.get('http://www.cbioportal.org/api/studies/'+study.studyId+'/patients')
        allPromises = allPromises.concat([axios.get('http://www.cbioportal.org/api/studies/' + this.props.study.studyId + '/patients/'+ s.patientId +'/clinical-events')
          .then(response => {
            allData = allData.concat(response.data);

            //console.log("Alldata: "+ allData[0]["patientId"]);

          })]);


          
      })

      

      a.forEach(s=>{
        

        allPromises = allPromises.concat([axios.get('http://www.cbioportal.org/api/studies/' + this.props.study.studyId + '/patients/'+ s.patientId +'/clinical-data')
          .then(response => {
            clinicalData = clinicalData.concat(response.data);

            //console.log("ClinicalData: " + clinicalData[0]["patientId"]);

          })]);

      });

     
      

      Promise.all(allPromises)
        .then(() => {
          this.dovis(a, allData, clinicalData);

          //console.log("ClinicalData 2: " + allData );


        })
    }

    getStudyJson(study) {
       // console.log(study);

       axios.get('http://www.cbioportal.org/api/studies/'+study.studyId+'/patients')
       .then(response => {
         /*this.setState({
            singlestudydata: response.data
         })*/

         //var r=
         
         this.setState({
          showSVG: !this.state.showSVG
        });
        this.visdata(response.data);
         //console.log(r);

         //var wnd = window.open('about:blank', "", "");

        // var wnd = window.open('', "", "");


         //wnd.document.write(JSON.stringify(r));
         //wnd.document.write("<pre>"+JSON.stringify(response.data, null, 4)+"</pre");
 



       })



    }
    render() {
      if(this.state.showSVG) {
        return (
          <li className="list-item">
            <label className="link" onClick={event => this.getStudyJson(this.props.study)}>
              {this.props.study.name}, {this.props.study.studyId}
            </label>
            <div className="svg-div">
              <svg width="900" height="900">
                <g ref="anchor" />
              </svg> 


              <button id="btn">PatientId/Age</button>


              <svg width="900" height="900">
                <g ref="anchor2" />
              </svg> 




              
            </div>

            
          </li>
        );
      } else {
        return (
          <li className="list-item">
            <label className="link" onClick={event => this.getStudyJson(this.props.study)}>
              {this.props.study.name}, {this.props.study.studyId}
            </label>
          </li>
        );
      }
    }
    
}
let data1 = [],
  data2 = [],
  data3 = [];
let timeline1, timeline2, timeline3;
let dataLengthv, dataLengthc, dataLengthf;
let stop1 = false,
  stop2 = false,
  stop3 = false;
let yAxisNum = 7;
let enterTime = new Date().getTime();
class Svg {
  constructor(parentId) {
    this.width = window.innerWidth < 400 ? 400: window.innerWidth * 0.99;
    this.height = 
      window.innerHeight < 500 ? 200: (window.innerHeight * 1.00) / 3;
    this.div = d3.select(`#${parentId}`);
    this.margin = {
      left: 30,
      right: 20,
      top: 50,
      bottom: 90,
    };
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.svg = this.div
      .selectAll("svg")
      .data([1])
      .join("svg")
      .attr("width", this.width)
      .attr("height", this.height);
    this.svg.selectAll("*").remove();
    this.g = this.svg
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

    this.xAxis = this.g
      .append("g")
      .attr("transform", `translate(${0},${this.innerHeight})`)
      .attr("class", "xaxis");
    this.yAxis = this.g.append("g").attr("class", "yaxis");

    this.title = this.svg.append("g").attr("transform", `translate(${0},30)`);
    this.xLabel = this.svg
      .append("g")
      .attr(
        "transform",
        `translate(${this.width / 2},${this.innerHeight + this.margin.top + 70
        })`
      );
    this.yLabel = this.svg
      .append("g")
      .attr(
        "transform",
        `translate(${this.margin.left * 0.1},${this.height / 2.5}) rotate(90)`
      );
    // this.toolTip = d3.select('body').data([1]).join('div').attr('class', 'tooltip').style('display', 'none').attr('position', 'absolute')
    this.legend = this.svg.append("g"); //Legend
    this.zoom = d3
      .zoom()
      .translateExtent([
        [this.margin.left, this.margin.top],
        [this.innerWidth, this.innerHeight],
      ])
      .extent([
        [this.margin.left, this.margin.top],
        [this.innerWidth, this.innerHeight],
      ])
      .scaleExtent([0.0001, 30]);
  }

  init(title, xLabel, yLabel) {
    this.x
      ? this.xAxis.call(
        d3
          .axisBottom(this.x)
          .tickFormat(d3.timeFormat("%X"))
          .ticks(resTicks())
      )
      : undefined;
    this.y ? this.yAxis.call(d3.axisLeft(this.y).ticks(yAxisNum)) : undefined;
    this.title
      ? this.title
        .selectAll("text")
        .data([1])
        .join("text")
        .attr("font-size", "1.5rem")
        .text(title)
      : undefined;
    this.xLabel
      ? this.xLabel
        .selectAll("text")
        .data([1])
        .join("text")
        .attr("font-size", "1.2rem")
        .attr("text-anchor", "middle")
        .text(xLabel)
      : undefined;
    //this.yLabel
    //  ? this.yLabel
    //    .selectAll("text")
    //    .data([1])
    //    .join("text")
    //    .attr("font-size", "1.2rem")
    //    .attr("text-anchor", "middle")
    //    .style("z-index", 999)
    //    .text(yLabel)
    //  : undefined;

    if (this.yAxis.selectAll("rect")._groups[0].length < 2) {
      this.yAxis
        .insert("rect", "path")
        .attr("width", this.margin.left)
        .attr("x", -this.margin.left)
        .attr("height", this.height)
        .attr("y", -20)
        .attr("fill", "white");
    }
    if (this.xAxis.selectAll("rect")._groups[0].length < 2) {
      this.xAxis
        .insert("rect", "path")
        .attr("width", this.width)
        .attr("x", -this.margin.left)
        .attr("height", this.margin.top)
        .attr("y", -this.innerHeight - this.margin.top)
        .attr("fill", "white");
      this.xAxis
        .insert("rect", "path")
        .attr("width", this.width)
        .attr("x", -this.margin.left)
        .attr("height", this.margin.bottom)
        .attr("y", 0)
        .attr("fill", "white")
    }
    this.yAxis.selectAll("text").attr("font-size", "0.9rem");
    this.xAxis.selectAll("text").attr("font-size", "0.9rem");
  }

  tooltipShow(html) {
    this.toolTip.style("display", "block");
    this.toolTip
      .style("top", event.pageY - 10 + "px")
      .style("left", event.pageX + 10 + "px");
    this.toolTip.html(html);
  }
  tooltipHide() {
    this.toolTip.style("display", "none");
  }
}

class TimeLIne extends Svg {
  constructor(parentId, title, ytitle, line1Text, line2Text) {
    super(parentId);
    this.titleText = title;
    this.ytitle = ytitle;
    this.l1Text = line1Text;
    this.l2Text = line2Text;
    this.id = parentId;
    this.center = [this.width / 2, this.height / 2];
    this.t = d3.zoomIdentity;
    this.lineG = this.g.append("g").lower(); //
    this.initChart();
    // this.startZoom();
  }


  initChart() {
    this.updateTime();
    this.x = d3
      .scaleTime()
      .domain([this.minTime, this.maxTime])
      .range([0, this.innerWidth]);
    //ydomain


    let ydomain = [0, 1];
    if (this.id === "timeline") {
      ydomain[1] = +d3.select(`.timeline .ymax`).property("value");
      ydomain[0] = +d3.select(`.timeline .ymin`).property("value");
      //default[0,40]
      ydomain[0] = 0
      ydomain[1] = 40
      d3.select(`.timeline .ymin`).property("value", 0);
      d3.select(`.timeline .ymax`).property("value", 40);
    } else if (this.id === "timeline1") {
      ydomain[1] = +d3.select(`.timeline1 .ymax`).property("value");
      ydomain[0] = +d3.select(`.timeline1 .ymin`).property("value");
      //default[0,100]
      ydomain[0] = 0
      ydomain[1] = 100
      d3.select(`.timeline1 .ymin`).property("value", 0);
      d3.select(`.timeline1 .ymax`).property("value", 100);
    } else {
      ydomain[1] = +d3.select(`.timeline2 .ymax`).property("value");
      ydomain[0] = +d3.select(`.timeline2 .ymin`).property("value");
      //default[0,30]
      ydomain[0] = 0
      ydomain[1] = 30
      d3.select(`.timeline2 .ymin`).property("value", 0)
      d3.select(`.timeline2 .ymax`).property("value", 30)
    }

    this.y = d3.scaleLinear().domain(ydomain).range([this.innerHeight, 0]);

    this.init(
      this.titleText,
      "Latest Time at Date: " + d3.timeFormat("%x %X")(enterTime),
      this.ytitle
    );

    this.addLegend();

  }

  drawLine(data, lineNumber, dim, color) {

    this.updateXscale();
    this.updateLegend(lineNumber, color)

    this.line = d3
      .line()
      .x((d) => this.x(new Date(d.time)))
      .y((d) => this.y(d[dim]));

    this.lineG
      .selectAll(`.${lineNumber}`)
      .data([1])
      .join("path")
      .datum(data)
      .attr("d", this.line)
      .attr("class", lineNumber)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2.5);

    this.updateAxis();
    this.addDateToAxis();

    this.init(
      this.titleText,
      "Latest Time at Date: " + d3.timeFormat("%x %X")(enterTime),
      this.ytitle
    );
  }

  updateXscale() {
    if (this.t) {
      this.updateTime();
      this.x1 = d3
        .scaleTime()
        .domain([this.minTime, this.maxTime])
        .range([0, this.innerWidth]);
      this.x.domain(this.t.rescaleX(this.x1).domain());
    } else {
      this.updateTime();
      this.x.domain([this.minTime, this.maxTime]);
    }
  }
  updateYscale() {
    //yMax  and  yMin
    this.yMaxValue = d3.select(`.${this.id}  .ymax`).property("value");
    this.yMinValue = d3.select(`.${this.id}  .ymin`).property("value");

    this.y.domain([this.yMinValue, this.yMaxValue]);
  }

  addDateToAxis() {
    if (
      this.xAxis.selectAll(".xaxis .tick .mytext")._groups[0].length !=
      this.xAxis.selectAll(".xaxis .tick")._groups[0].length
    ) {
      this.xAxis.selectAll(".xaxis .tick .mytext").remove();
      this.xAxis
        .selectAll(".xaxis .tick")
        .append("text")
        .attr("class", "mytext")
        .text((d) => d3.timeFormat("%x")(d))
        .attr("fill", "currentcolor")
        .attr("y", 30)
        .attr("dy", "0.9em");
    }
  }

  updateAxis() {
    this.xAxis.call(
      d3.axisBottom(this.x).ticks(resTicks()).tickFormat(d3.timeFormat("%X"))
    );
  }
  startZoom() {
    this.zoom.on("zoom", this.zoomed);
    this.svg.call(this.zoom);
  }

  zoomed = () => {

    this.t = d3.event.transform;
    this.updateXscale();
  };
  addLegend() {
    this.legend = this.svg
      .append("g")
      .attr(
        "transform",
        `translate(${this.margin.left + 10},${this.margin.top + 10})`
      );
    this.legend
      .append("path")
      .attr('class', 'line1')
      .attr("d", "m 0,0 l 30,0")
      .attr("stroke", "red");
    this.legend
      .append("path")
      .attr('class', "line2")
      .attr("d", "m 0,20 l 30,0")
      .attr("stroke", "green");
    this.legend.append("text").attr("x", 40).attr("y", 5).text(this.l1Text);
    this.legend.append("text").attr("x", 40).attr("y", 25).text(this.l2Text);
  }
  updateTime() {
    this.minTime = new Date().getTime() - 100000;
    this.maxTime = new Date().getTime(); //+ 100000
  }
  updateLegend(lineNumber, color) {
    this.legend.select(`.${lineNumber}`).attr('stroke', color)

  }

}

async function timeLine() {

  getValueFromLocalStorage();

  timeline1 = await initChart("timeline", "Velocity vs Time", "velocity [m/s]", "velocity1", "velocity2");
  timeline2 = await initChart("timeline1", "Concentration vs Time", "Concentration [%]", "concentration1", "concentration2");
  timeline3 = await initChart("timeline2", "Flux vs Time", "Flux [kg/h]", "flux1", "flux2");

  d3.select("#yscale1").on("click", () => {
    updateYscale(timeline1, 1);
  });

  d3.select("#yscale2").on("click", () => {
    updateYscale(timeline2, 2);
  });

  d3.select("#yscale3").on("click", () => {
    updateYscale(timeline3, 3);
  });

  d3.select(`#xPlus`).on("click", () => {


    [timeline1, timeline2, timeline3].forEach((d) => {
      zoomPlusReduce(1.1, d);
    });
  });
  d3.select(`#xReduce`).on("click", () => {
    [timeline1, timeline2, timeline3].forEach((d) => {
      zoomPlusReduce(1 / 1.1, d);
    });
  });
  function zoomPlusReduce(factor, timeline) {
    if (!timeline.t) {
      timeline.t = d3.zoomIdentity;
    }

    let k0 = timeline.t.k;
    timeline.t.k = timeline.t.k * factor;
    let x = timeline.t.x;
    // If we're already at an extent, done
    if (timeline.t.k === 0.0001 || timeline.t.k === 30) {
      return false;
    }
    // If the factor is too much, scale it down to reach the extent exactly
    let clamped_target_scale = Math.max(0.0001, Math.min(30, timeline.t.k));
    if (clamped_target_scale != timeline.t.k) {
      timeline.t.k = clamped_target_scale;
      factor = timeline.t.k / k0;
    }

    x = (x - timeline.center[0]) * factor + timeline.center[0];
    timeline.t.x = x;
    timeline.updateXscale();
  }

  async function initChart(id, title, ytitle, l1, l2) {
    const timeline = new TimeLIne(id, title, ytitle, l1, l2);
    //d3.select(`#stop`).on("click", () => {

    //  stop1 = true;
    //  stop2 = true;
    //  stop3 = true;
    //});
    d3.select(`#start`).on("click", () => {
      if(stop1){
        stop1 = false;
        stop2 = false;
        stop3 = false;
        d3.select(`#start`).attr('class', 'btn btn-danger')
      }else{
        stop1 = true;
        stop2 = true;
        stop3 = true;
        d3.select(`#start`).attr('class', 'btn btn-success')
      }    
    });
    //y+
    d3.select(`.${id} #yPlus`).on("click", () => {
      const domain = timeline.y.domain();
      const median = ((domain[0] + domain[1]) / 2);
      domain[1] = (domain[1] / 1.1);
      domain[0] = median - (domain[1] - median); //

      timeline.y.domain(domain);

      timeline.yAxis.call(d3.axisLeft(timeline.y).ticks(yAxisNum));
    });
    //y-
    d3.select(`.${id}  #yReduce`).on("click", () => {
      const domain = timeline.y.domain();
      const median = ((domain[0] + domain[1]) / 2);
      domain[1] = (domain[1] * 1.1);
      domain[0] = median - (domain[1] - median); //y
      timeline.y.domain(domain);

      timeline.yAxis.call(d3.axisLeft(timeline.y).ticks(yAxisNum));
    });

    return timeline;
  }
}
timeLine();
//test
setInterval(() => {
  d3.select("#v1").property("value", (Math.random() * 9 + 1).toFixed(2));
  d3.select("#v2").property("value", (Math.random() * 9 + 1).toFixed(2));
  d3.select("#c1").property("value", (Math.random() * 9 + 1).toFixed(2));
  d3.select("#c2").property("value", (Math.random() * 9 + 1).toFixed(2));
  d3.select("#f1").property("value", (Math.random() * 9 + 1).toFixed(2));
  d3.select("#f2").property("value", (Math.random() * 9 + 1).toFixed(2));
}, 1000);
//color for each line
const line_1_color = "red"
const line_2_color = "blue"
const line_3_color = "green"
const line_4_color = "red"
const line_5_color = "red"
const line_6_color = "green"

setInterval(() => interValFunc(timeline1, stop1, 'v', line_1_color, line_2_color), 1000);
setInterval(() => interValFunc(timeline2, stop2, 'c', line_3_color, line_4_color), 1000);
setInterval(() => interValFunc(timeline3, stop3, 'f', line_5_color, line_6_color), 1000);

function interValFunc(timeline, stop, cate, color1, color2) {
  let len = dataLengthv;
  if (timeline.id === "timeline") {
    productLine(data1);
  } else if (timeline.id === "timeline1") {
    productLine(data2);
  } else {
    productLine(data3);
  }

  function productLine(data) {
    if (!stop) {
      // production

      //let URL = document.URL;
      //URL = URL.replace("index.html", "") + "responseArray_trueformat";
      //$.getJSON(URL, (res) => {
      //data.push({
      //time: new Date().getTime(),
      //velocity1: +res.Array.split(",")[getNum(cate)[0]],
      //velocity2: +res.Array.split(",")[getNum(cate)[1]],
      //});
      //data = len === 0 ? data : data.slice(-len);
      //redrawLine(timeline, data, color1, color2);
      //d3.select("#v1").property("value", res.Array.split(",")[0]);
      //d3.select("#v2").property("value", res.Array.split(",")[1]);
      //d3.select("#c1").property("value", res.Array.split(",")[2]);
      //d3.select("#c2").property("value", res.Array.split(",")[3]);
      //d3.select("#f1").property("value", res.Array.split(",")[4]);
      //d3.select("#f2").property("value", res.Array.split(",")[5]);
      //});

      //function getNum(cate) {
      //if (cate === "v") {
      //return [0, 1];
      //} else if (cate === "c") {
      //return [2, 3];
      //} else {
      //return [4, 5];
      //}
      //}

      // test

      data.push({
        time: new Date().getTime(),
        velocity1: Math.random() * 10 + 9,
        velocity2: Math.random() * 10 + 9,
      });
      data = len === 0 ? data : data.slice(-len);
      redrawLine(timeline, data, color1, color2);
    }
  }
}
//listen to front end and record the number
d3.select("#apply1").on("click", () => {
  dataLengthv = d3.select("#inputText1").property("value");
  dataLengthv = Number.parseInt(dataLengthv); //convert to int
  localStorage.setItem("dataLengthv", dataLengthv); //record the number
});

function resTicks() {
  let ticks = 8;
  if (window.innerWidth < 700) {
    ticks = 3;
  } else {
    ticks = 8;
  }
  return ticks;
}
function resWidth(w) {
  let width = 0.1;
  if (window.innerWidth < 700) {
    width = 0.15;
  } else {
    width = 0.04;
  }
  return width * w;
}
window.onresize = () => {

  timeLine();
};
function redrawLine(timeline, data, lin1color, line2color) {
  timeline.drawLine(data, "line1", "velocity1", lin1color); //
  timeline.drawLine(data, "line2", "velocity2", line2color); //
}

function getValueFromLocalStorage() {
  d3.select("#inputText1").property(
    "value",
    +localStorage.getItem("dataLengthv")
  );
  d3.select(`.timeline .ymax`).property(
    "value",
    +localStorage.getItem("yMaxValue1")
  );
  d3.select(`.timeline .ymin`).property(
    "value",
    +localStorage.getItem("yMinValue1")
  );
  d3.select(`.timeline1 .ymax`).property(
    "value",
    +localStorage.getItem("yMaxValue2")
  );
  d3.select(`.timeline1 .ymin`).property(
    "value",
    +localStorage.getItem("yMinValue2")
  );
  d3.select(`.timeline2 .ymax`).property(
    "value",
    +localStorage.getItem("yMaxValue3")
  );
  d3.select(`.timeline2 .ymin`).property(
    "value",
    +localStorage.getItem("yMinValue3")
  );
}

function updateYscale(timeline, i) {
  let yMaxValue = +d3.select(`.${timeline.id}  .ymax`).property("value");
  let yMinValue = +d3.select(`.${timeline.id}  .ymin`).property("value");
  localStorage.setItem(`yMaxValue${i}`, yMaxValue);
  localStorage.setItem(`yMinValue${i}`, yMinValue);
  timeline.y.domain([yMinValue, yMaxValue]);

  timeline.yAxis.call(d3.axisLeft(timeline.y).ticks(yAxisNum));
}

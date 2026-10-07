/** Diagram inputs contain the question's givens, never a worked solution. */
export type QuestionVisual={kind:string;a:number;b:number;c?:number;d?:number;values?:number[];labels?:string[]};
export function questionVisual(id:string,seed:number):QuestionVisual|undefined{
 const a=2+seed%5,b=1+Math.floor(seed/5)%4,c=2+Math.floor(seed/20)%4;
 switch(id){
 case 'compare':return {kind:'compare',a,b:a+b};
 case 'zero':return {kind:'subtract',a:a+b,b:a+b};
 case 'shapes1':return {kind:'polygon',a:seed%2?4:3,b:0};
 case 'pattern1':return {kind:'sequence',a:0,b:0,values:seed%2?[a,a+b,a,a+b]:[a+b,b,a+b,b,a+b],labels:['Repeating pattern']};
 case 'length1':return {kind:'bars',a:0,b:0,values:[a,a+b],labels:['Strip A','Strip B','blocks']};
 case 'time2':return {kind:'clocks',a:a*60,b:(a+b)*60};
 case 'measure2':return {kind:'ruler',a,b:a+b+c};
 case 'data2':return {kind:'bars',a:0,b:0,values:[a,b],labels:['Circles','Squares','shapes']};
 case 'hundreds3':return {kind:'digits',a:0,b:0,values:[a,b,c],labels:['Hundreds','Tens','Ones']};
 case 'fractions3':return {kind:'fraction',a:1,b:b+2};
 case 'clock3':return {kind:'clocks',a:120+35+5*b,b:180+5*c};
 case 'shapes3':return {kind:'rectangle',a,b:a};
 case 'symmetry4':return {kind:'reflection',a:seed%2?6:4,b:4};
 case 'symmetry6':return {kind:'symmetry',a:seed%2?6:4,b:4};
 case 'data4':return {kind:'pictograph',a,b:b+1};
 case 'decimal_place5':return {kind:'digits',a:0,b:0,values:[a,c,b],labels:['Ones','Tenths','Hundredths']};
 case 'fraction_add5':return {kind:'fraction-sum',a,b,c:a+b+c};
 case 'volume5':return {kind:'cuboid',a,b,c};
 case 'angles5':return {kind:'turn',a:seed%2?180:90,b:0};
 case 'patterns5':return {kind:'sequence',a:0,b:0,values:[a,a+b,a+2*b],labels:['First three terms · find term 5']};
 case 'data5':return {kind:'bars',a:0,b:0,values:[a*10,a*10+b*c],labels:['Monday','Tuesday','visitors']};
 case 'fraction_calc6':return {kind:'fraction-sum',a:c,b:1,c:2*c,labels:['1/2',`1/${2*c}`]};
 case 'angle6':return {kind:'angle',a:a*10+b*5,b:0};
 case 'mean6':return {kind:'bars',a:0,b:0,values:[a,a+b,a+2*b],labels:['Day 1','Day 2','Day 3','count']};
 case 'rational7':return {kind:'numberline',a:-c,b,c:2*c};
 case 'circle7':return {kind:'circle',a:7*b,b:0};
 case 'probability7':return {kind:'outcomes',a:6,b:seed%2};
 case 'square_root8':case 'real9':return {kind:'square-root',a:a+b,b:a+b};
 case 'identity8':return {kind:'partition',a:10,b:a};
 case 'coordinates9':return {kind:'coordinates',a,b:c,c:a+3*b,d:c+4*b};
 case 'statistics9':return {kind:'sequence',a:0,b:0,values:[a+2*b,a,a+b,a+4*b,a+3*b],labels:['Find the middle after ordering']};
 case 'trig10':return {kind:'triangle',a:3*b,b:4*b,c:5*b,labels:['θ']};
 case 'statistics10':return {kind:'frequency',a,b:a+10,c:2,d:b};
 case 'integer':return {kind:'numberline',a:-a,b,c:1};
 case 'equation':return {kind:'balance',a:b,b:a+b,c:1};
 case 'linear':return {kind:'balance',a:b,b:(b+1)*a+b,c:b+1};
 case 'slope':return {kind:'slope',a,b};
 case 'percent':return {kind:'percent',a:[10,25,50,75][b-1],b:a*20};
 case 'decimal':return {kind:'fraction-sum',a,b,c:10,labels:[(a/10).toFixed(1),(b/10).toFixed(1)]};
 }
}

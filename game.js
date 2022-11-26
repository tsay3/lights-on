class Button extends React.Component {
    render() {
     return (
       <button class="light" type="button"/>
      );
    }
   }
   class Board extends React.Component {
    render() {
     for (var j = 0; j < 3; j++) {
      return (
       <div className="row">
      );
      for (var i = 0; i < 3; i++) {
       <Button />
      }
      return (
       </div>
      );
     }
    }
   }
   class Game extends React.Component {
     render() {
       return (
         <div className="game">
           <div className="board">
             <Board />
           </div>
           <div className="info">
           </div>
         </div>
       );
     }
   }
   const root = ReactDOM.createRoot(document.getElementById("root"));
   root.render(<Game />);

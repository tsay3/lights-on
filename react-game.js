
const domContainer = document.querySelector('#react-root');
const root = ReactDOM.createRoot(domContainer);

const e = React.createElement;

class LightButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lit: false };
  }

  render() {
    if (this.state.lit) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ lit: true }) },
      'Like'
    );
  }
}

root.render(e(LikeButton));

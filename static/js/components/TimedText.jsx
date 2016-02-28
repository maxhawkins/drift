import React from 'react';

export default class TimedText extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.words !== nextProps.words ||
      this.props.scaleX !== nextProps.scaleX;
  }
  render() {
    var data = this.props.words;
    var words = [];

    for (var i = 0; i < data.length; i++) {
      var alignedWord = data[i];
      var x = this.props.scaleX * alignedWord.start

      words.push(<Word
        key={`${alignedWord.word}-${alignedWord.start}`}
        text={alignedWord.word}
        transform={`translate(${x}, 0)`} />);
    }

    return (<g className="timed-text" transform={this.props.transform}>
      {words}
    </g>);
  }
}

TimedText.defaultProps = {
  words: [],
  scaleX: 1,
};

class Word extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.text !== nextProps.text ||
      this.props.transform !== nextProps.transform;
  }
  render() {
    return (<g className="word" transform={this.props.transform}>
      <line x1="0" x2="0" y1="-100%" y2="100%" />
      <text fontSize="10" transform="translate(2, 10)">
        {this.props.text}
      </text>
    </g>);
  }
}

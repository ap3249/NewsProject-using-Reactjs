import React, { Component } from 'react'
import NewItems from './NewItems'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
    static defaultProps = {
      country: 'in',
      pageSize: 8,
      category: 'general',
    }

    static propTypes = {
      country: PropTypes.string,
      pageSize: PropTypes.number,
      category: PropTypes.string,
    }
    capitalizeFirstLetter = (string)=> {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    constructor(props){
        super(props);
        console.log("Hello I am a constructor from News Component");
        this.state = {
            articles: [],
            loading: true,
            page: 1,
            totalResults: 0
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - CuriousNews`
    }   

    async updateNews(){
        this.props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=${this.props.apikey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true});
        let data = await fetch(url);
        this.props.setProgress(30);
        let parsedData = await data.json()
        this.props.setProgress(50);
        console.log(parsedData);
        this.setState({articles: parsedData.articles, 
          totalArticles: parsedData.totalResults,
          loading: false
        })
        this.props.setProgress(100);
      }

    async componentDidMount(){
        this.updateNews();
        // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=cdebab93f0fa4ef8823c4cac58555751&page=1&pageSize=${this.props.pageSize}`;
        // this.setState({loading: true});
        // let data = await fetch(url);
        // let parsedData = await data.json()
        // console.log(parsedData);
        // this.setState({articles: parsedData.articles, 
        //                totalArticles: parsedData.totalResults,
        //                loading: false})
    }

    handlePrevClick =async ()=>{
        // console.log("Previous");

        // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=business&category=${this.props.category}&apikey=cdebab93f0fa4ef8823c4cac58555751&page=${this.state.page -1}&pageSize=${this.props.pageSize}`;
        // this.setState({loading: true});
        // let data = await fetch(url);
        // let parsedData = await data.json()
        // console.log(parsedData)
        // this.setState({})
        // this.setState({
        //   page: this.state.page - 1,
        //   articles: parsedData.articles,
        //   loading: false
        // })
        this.setState({page: this.state.page -1})
        this.updateNews();
      }
      handleNextClick =async ()=>{
        // console.log("Next");
        // if(!(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize))){
          
          //   let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=business&category=${this.props.category}&apikey=cdebab93f0fa4ef8823c4cac58555751&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
          //   this.setState({loading: true});
          //   let data = await fetch(url);
          //   let parsedData = await data.json()
          //   console.log(parsedData);
          
          //   this.setState({
          //     page: this.state.page + 1,
          //     articles: parsedData.articles,
          //     loading: false
          //   })    
          // }
            this.setState({page: this.state.page + 1})
            this.updateNews();
    }

    fetchMoreData =async () => {
      this.setState({page: this.state.page + 1});
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=${this.props.apikey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      let data = await fetch(url);
      let parsedData = await data.json()
      console.log(parsedData);
      this.setState({articles: this.state.articles.concat (parsedData.articles), 
                     totalArticles: parsedData.totalResults,
                     loading: false})
    };

  render() {   
    return (
      <div className="container my-3">
            <h1 style={{margin:"35px 0px"}} className="text-center">CuriousNews - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
            {this.state.loading && <Spinner/>}
            <InfiniteScroll
                dataLength={this.state.articles.length}
                next={this.fetchMoreData}
                hasMore={this.state.articles.length !== this.state.totalResults}
                loader={<Spinner/>}
            >
              <div className="container">

            <div className="row">
            {this.state.articles.map((element)=>{
              return <div className="col-md-4" key={element.url}>
                    <NewItems title={element.title?element.title.slice(0, 45):""} description={element.description?element.description.slice(0,88):""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                </div>
            })}               
            </div>

            </div>

            </InfiniteScroll>
            {/* <div className="d-flex justify-content-between">
            <button disabled={this.state.page<=1} type="button" onClick={this.handlePrevClick}  className="btn btn-dark">&larr; Previous</button>
            <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" onClick={this.handleNextClick} className="btn btn-dark">Next &rarr;</button>
            </div> */}

      </div>
    )
  }
}

export default News
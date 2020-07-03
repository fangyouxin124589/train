import React from "react";
import axios from "axios";
import GithubList from "./GithubList";
import Load from "./Load";
import "../css/Tab.css";

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.addMore = this.addMore.bind(this);
    this.state = {
      tabList: [
        {
          name: "All",
          url:
            "https://api.github.com/search/repositories?q=stars:%3E11&sort=stars&order=desc&type=Repositories",
        },
        {
          name: "java",
          url:
            "https://api.github.com/search/repositories?q=stars:%3E11+language:java&sort=stars&order=desc&type=Repositories",
        },
        {
          name: "javascript",
          url:
            "https://api.github.com/search/repositories?q=stars:%3E11+language:javascript&sort=stars&order=desc&type=Repositories",
        },
        {
          name: "css",
          url:
            "https://api.github.com/search/repositories?q=stars:%3E11+language:css&sort=stars&order=desc&type=Repositories",
        },
        {
          name: "ruby",
          url:
            "https://api.github.com/search/repositories?q=stars:%3E1+language:ruby&sort=stars&order=desc&type=Repositories",
        },
        {
          name: "python",
          url:
            "https://api.github.com/search/repositories?q=stars:%3E1+language:python&sort=stars&order=desc&type=Repositories",
        },
      ],
      tabName: "All",
      tabUrl:
        "https://api.github.com/search/repositories?q=stars:%3E11&sort=stars&order=desc&type=Repositories",
      githubData: [],
      count: 0,
      loading: true,
      addNumber: 10,
    };
  }

  switchTab = (e, { name, url }) => {
    let { target } = e;
    // console.log(target);
    const filterOption = target.getAttribute("data-filter");
    if (filterOption) {
      document.querySelectorAll(".tab-list.active").forEach((btn) => {
        // console.log(btn);
        btn.classList.remove("active");
      });
      target.classList.add("active");
    }
    this.setState({
      tabName: name,
      tabUrl: url,
      addNumber: 10,
    });
    localStorage.setItem("name", name);
    localStorage.setItem("url", url);
    setTimeout(() => {
      this.FetchGit();
    }, 200);
  };

  addMore() {
    const number = this.state.addNumber + 10;
    // console.log(number)
    this.setState({
      addNumber: number,
    });
    this.FetchGit();
  }

  //获得数据
  async FetchGit() {
    this.setState({
      githubData: [],
    });
    if (this.state.count === 0) {
      const name = localStorage.getItem("name");
      const { addNumber } = this.state;
      if (name) {
        const res = await axios.get(localStorage.getItem("url"));
        this.setState({
          githubData: res.data.items.slice(0, addNumber),
          loading: false,
          count: this.state.count + 1,
          name: localStorage.getItem("name"),
          tabUrl: localStorage.getItem("url"),
        });
        const filterOption = document.getElementById(
          localStorage.getItem("name")
        );
        if (filterOption) {
          document
            .querySelectorAll(".tab-list.active")
            .forEach((btn) => btn.classList.remove("active"));
          filterOption.classList.add("active");
        }
      } else {
        const res = await axios.get(this.state.tabUrl);
        const { addNumber } = this.state;
        this.setState({
          githubData: res.data.items.slice(0, addNumber),
          loading: false,
        });
        const filterOption = document.getElementById("All");
        if (filterOption) {
          document
            .querySelectorAll(".tab-list.active")
            .forEach((btn) => btn.classList.remove("active"));
          filterOption.classList.add("active");
        }
      }
    } else {
      const res = await axios.get(this.state.tabUrl);
      const { addNumber } = this.state;
      this.setState({
        githubData: res.data.items.slice(0, addNumber),
        loading: false,
      });
    }
  }

  componentDidMount() {
    this.FetchGit();
  }

  render() {
    let renderInfo;
    const { githubData, loading } = this.state;
    const addList = loading ? "add_hide" : "add_more";
    if (githubData.length !== 0) {
      renderInfo = githubData.map((item, index) => {
        return (
          <GithubList
            key={index}
            listNum={++index}
            avatar={item.owner.avatar_url}
            name={item.name}
            stargazersCount={item.stargazers_count}
            forksCount={item.forks_count}
            openIssuesCount={item.open_issues_count}
            htmlUrl={item.html_url}
          />
        );
      });
    } else {
      renderInfo = (
        <div>
          <h3 style={{ textAlign: "center" }}>
            世界名画~（github热门项目加载中）
          </h3>
          <Load />
        </div>
      );
    }
    return (
      <div>
        <span className="title">Github热门项目</span>
        <div className="tab">
          {this.state.tabList.map((list, index) => {
            return (
              <button
                key={index}
                className="tab-list"
                data-filter={list.name}
                id={list.name}
                onClick={(e) => this.switchTab(e, list)}
              >
                {list.name}
              </button>
            );
          })}
        </div>
        <div className="list-content">
          {/* {githubData.length !== 0 ? (
            githubData.map((item, index) => {
              return (
                <GithubList
                  key={index}
                  listNum={++index}
                  avatar={item.owner.avatar_url}
                  name={item.name}
                  stargazersCount={item.stargazers_count}
                  forksCount={item.forks_count}
                  openIssuesCount={item.open_issues_count}
                  htmlUrl={item.html_url}
                />
              );
            })
          ) : (
            <div>
              <h3 style={{ textAlign: "center" }}>
                世界名画~（github热门项目加载中）
              </h3>
              <Load />
            </div>
          )} */}
          {renderInfo}
        </div>
        <div className={addList}>
          <button type="button" onClick={this.addMore} className="addBtn">
            加载更多
          </button>
        </div>
      </div>
    );
  }
}

export default Tab;

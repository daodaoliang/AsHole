import React, {Component, PureComponent} from 'react';
import {LoginForm, PostForm} from './UserAction';
import {TokenCtx} from './UserAction';
import {PromotionBar} from './Common';

import './Title.css';

const flag_re=/^\/\/setflag ([a-zA-Z0-9_]+)=(.+)$/;

const HELP_TEXT=(
    <div className="box">
        <p>使用提示：</p>
        <ul>
            <li>为保证使用体验，请使用 Chrome 或 Mobile Safari 浏览器最新版</li>
            <li>在搜索框输入 #472865 等可以查看指定 ID 的树洞</li>
            <li>新的帖子会在左上角显示一个圆点</li>
            <li>本网站支持 3D Touch，重压屏幕可以快速返回 / 刷新树洞</li>
        </ul>
        <p>使用本网站时，您需要了解并同意：</p>
        <ul>
            <li>所有数据来自 PKU Helper，本站不对其内容负责</li>
            <li>
                不接受关于 UI 的建议，
                功能建议请在 <a href="https://github.com/xmcp/ashole" target="_blank">GitHub</a> 提出
            </li>
            <li>英梨梨是我的，你们都不要抢</li>
        </ul>
        <p>By @xmcp</p>
        <br />
        <p>
            This program is free software: you can redistribute it and/or modify
            it under the terms of the GNU General Public License as published by
            the Free Software Foundation, either version 3 of the License, or
            (at your option) any later version.
        </p>
        <br />
        <p>
            This program is distributed in the hope that it will be useful,
            but WITHOUT ANY WARRANTY; without even the implied warranty of
            MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
            GNU General Public License for more details.
        </p>
    </div>
);

class ControlBar extends PureComponent {
    constructor(props) {
        super(props);
        this.state={
            search_text: '',
        };
        this.set_mode=props.set_mode;

        this.on_change_bound=this.on_change.bind(this);
        this.on_keypress_bound=this.on_keypress.bind(this);
        this.do_refresh_bound=this.do_refresh.bind(this);
        this.do_attention_bound=this.do_attention.bind(this);
    }

    componentDidMount() {
        if(window.location.hash) {
            let text=decodeURIComponent(window.location.hash).substr(1);
            if(text.lastIndexOf('?')!==-1)
                text=text.substr(0,text.lastIndexOf('?')); // fuck wechat '#param?nsukey=...'
            this.setState({
                search_text: text,
            }, ()=>{
                this.on_keypress({key: 'Enter'});
            });
        }
    }

    on_change(event) {
        this.setState({
            search_text: event.target.value,
        });
    }

    on_keypress(event) {
        if(event.key==='Enter') {
            let flag_res=flag_re.exec(this.state.search_text);
            if(flag_res) {
                localStorage[flag_res[1]]=flag_res[2];
                alert('Set Flag '+flag_res[1]+'='+flag_res[2]);
                return;
            }

            const mode=this.state.search_text.startsWith('#') ? 'single' : 'search';
            this.set_mode(mode,this.state.search_text||null);
        }
    }

    do_refresh() {
        window.scrollTo(0,0);
        this.setState({
            search_text: '',
        });
        this.set_mode('list',null);
    }

    do_attention() {
        window.scrollTo(0,0);
        this.setState({
            search_text: '',
        });
        this.set_mode('attention',null);
    }

    render() {
        return (
            <TokenCtx.Consumer>{({value: token})=>(
                <div className="control-bar">
                    <a className="control-btn" onClick={this.do_refresh_bound}>
                        <span className="icon icon-refresh" />
                    </a>
                    {!!token &&
                        <a className="control-btn" onClick={this.do_attention_bound}>
                            <span className="icon icon-attention" />
                        </a>
                    }
                    <input className="control-search" value={this.state.search_text} placeholder="搜索 或 #PID"
                           onChange={this.on_change_bound} onKeyPress={this.on_keypress_bound}
                    />
                    <a className="control-btn" onClick={()=>{
                        this.props.show_sidebar(
                            'P大树洞（非官方）网页版',
                            <div>
                                <PromotionBar />
                                <LoginForm />
                                {HELP_TEXT}
                            </div>
                        )
                    }}>
                        <span className={'icon icon-'+(token ? 'about' : 'login')} />
                    </a>
                    {!!token &&
                        <a className="control-btn" onClick={()=>{
                            this.props.show_sidebar(
                                '发表树洞',
                                <PostForm token={token} on_complete={()=>{
                                    this.props.show_sidebar('',null);
                                    this.do_refresh();
                                }} />
                            )
                        }}>
                            <span className="icon icon-plus" />
                        </a>
                    }
                </div>
            )}</TokenCtx.Consumer>
        )
    }
}

export function Title(props) {
    let date=new Date();
    let is_eriri_birthday=(1+date.getMonth())===3 && date.getDate()===20;

    return (
        <div className="title-bar">
            <div className="aux-margin">
                <div className="title">
                    <p className="centered-line">
                        P大树洞
                        &nbsp;
                        <a href="https://github.com/xmcp/ashole" target="_blank">
                            <span className="icon icon-github" />
                        </a>
                    </p>
                    <p className="title-small">
                        { is_eriri_birthday ?
                            <span style={{backgroundColor: 'yellow'}}>3月20日是看板娘<a href="https://zh.moegirl.org/%E6%B3%BD%E6%9D%91%C2%B7%E6%96%AF%E5%AE%BE%E5%A1%9E%C2%B7%E8%8B%B1%E6%A2%A8%E6%A2%A8" target="_blank">英梨梨</a>的生日</span> :
                            "非官方网页版 by @xmcp"
                        }
                    </p>
                </div>
                <ControlBar show_sidebar={props.show_sidebar} set_mode={props.set_mode} />
            </div>
        </div>
    )
}
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-09-05
// @description  try to take over the world!
// @author       You
// @match        https://www.instagram.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href === 'https://www.instagram.com/') {

        const username = "ENTER ACCOUNT UNSERNAME HERE";

        let followers = [{ username: "", full_name: "" }];
        let followings = [{ username: "", full_name: "" }];
        let dontFollowMeBack = [{ username: "", full_name: "" }];
        let iDontFollowBack = [{ username: "", full_name: "" }];

        followers = [];
        followings = [];
        dontFollowMeBack = [];
        iDontFollowBack = [];

        (async () => {
            try {
                console.log(`Process started! Give it a couple of seconds`);

                const userQueryRes = await fetch(
                    `https://www.instagram.com/web/search/topsearch/?query=${username}`
                );

                const userQueryJson = await userQueryRes.json();

                const userId = userQueryJson.users.map(u => u.user)
                .filter(
                    u => u.username === username
                )[0].pk;

                let after = null;
                let has_next = true;

                while (has_next) {
                    await fetch(
                        `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=` +
                        encodeURIComponent(
                            JSON.stringify({
                                id: userId,
                                include_reel: true,
                                fetch_mutual: true,
                                first: 50,
                                after: after,
                            })
                        )
                    )
                        .then((res) => res.json())
                        .then((res) => {
                        has_next = res.data.user.edge_followed_by.page_info.has_next_page;
                        after = res.data.user.edge_followed_by.page_info.end_cursor;
                        followers = followers.concat(
                            res.data.user.edge_followed_by.edges.map(({ node }) => {
                                return {
                                    username: node.username,
                                    full_name: node.full_name,
                                };
                            })
                        );
                    });
                }

                after = null;
                has_next = true;

                while (has_next) {
                    await fetch(
                        `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=` +
                        encodeURIComponent(
                            JSON.stringify({
                                id: userId,
                                include_reel: true,
                                fetch_mutual: true,
                                first: 50,
                                after: after,
                            })
                        )
                    )
                        .then((res) => res.json())
                        .then((res) => {
                        has_next = res.data.user.edge_follow.page_info.has_next_page;
                        after = res.data.user.edge_follow.page_info.end_cursor;
                        followings = followings.concat(
                            res.data.user.edge_follow.edges.map(({ node }) => {
                                return {
                                    username: node.username,
                                    full_name: node.full_name,
                                };
                            })
                        );
                    });
                }

                dontFollowMeBack = followings.filter((following) => {
                    return !followers.find(
                        (follower) => follower.username === following.username
                    );
                });

                console.log(dontFollowMeBack);

                var numUnfollowers = dontFollowMeBack.length;
                console.log(numUnfollowers);
                for (let i = 0; i < numUnfollowers; i++) {
                    unfollow(i, dontFollowMeBack[i]);
                }


            } catch (err) {
                console.log({ err });
            }

        })();
    } else {
        window.addEventListener("load", (event) => {
            setTimeout(function(){
                var unfollowButton = document.getElementsByClassName("_ap3a _aaco _aacw _aad6 _aade")[0];
                unfollowButton.click();
                setTimeout(function(){
                    var confirmButton = document.getElementsByClassName("x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1pi30zi x1swvt13 x1l90r2v xyamay9 x1uhb9sk x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1")[4];
                    console.log(confirmButton);
                    confirmButton.click();
                    setTimeout(function(){
                        window.close();
                    }, 2000);
                }, 1000);
            }, 1000);
        });
    }

})();

function unfollow(i, user) {
    setTimeout(function() {
        window.open("https://www.instagram.com/" + user.username);
        console.log("iteration: " + i);
    }, 5000 * i);
}

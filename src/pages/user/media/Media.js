import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import AddSeo from "../../../utils/AddSeo";
import Breadcrumb from "../../../components/user/ui/Breadcrumb/Breadcrumb";
import ButtonComponent from "../../../components/common/ui/button/ButtonComponent";
import Pagination from "../../../components/common/ui/pagination/Pagination";
import MediaVideoCard from "../../../components/user/MediaVideoCard";
import MediaArticleCard from "../../../components/user/MediaArticleCard";
import MediaReleaseCard from "../../../components/user/MediaReleaseCard";
import VideoPlayModel from "../../../components/common/ui/videoPlayModel/VideoPlayModel";
import "../../../assets/styles/media.scss";
import arrow from "../../../assets/images/left-arrow.png";
import urban_mobility from "../../../assets/images/urban_mobility.png";
import pitch_day from "../../../assets/images/pitch_day.png";
import innovation_meets from "../../../assets/images/innovation_meets.png";
import release_img1 from "../../../assets/images/article_img.png";
import release_img2 from "../../../assets/images/Picture1_93576.png";


const Media = () => {
  const navigate = useNavigate();

  // Video data operations
  const videoRef = useRef(null);
  const [showVideoPlayModel, setShowVideoPlayModel] = useState(false);
  const [currentVideoPage, setCurrentVideoPage] = useState(1);
  const [videoData, setVideoData] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const videoList = [
    {
      name: "Revolutionizing Urban Mobility with Transport Stack | JICA x BCG",
      description: "",
      date: "Aug 7, 2024",
      duration: "6 minutes",
      backgroundImage: innovation_meets,
      link: "https://dts-portal-assets.s3.ap-south-1.amazonaws.com/Revolutionizing+Urban+Mobility+with+Transport+Stack++BCG+x+JICA.mp4",
    },
    {
      name: "Introducing Transport Stack: Shaping the Future of Mobility",
      description: "",
      date: "Oct 18, 2024",
      duration: "2 minutes",
      backgroundImage: urban_mobility,
      link: "https://dts-portal-assets.s3.ap-south-1.amazonaws.com/Introducing+Transport+Stack+Shaping+the+Future+of+Mobility.mp4",
    },
    {
      name: "Transport Stack Open Innovation Challenge: Pitch Day",
      description: "",
      date: "Feb 3, 2025",
      duration: "3 minutes",
      backgroundImage: pitch_day,
      link: "https://dts-portal-assets.s3.ap-south-1.amazonaws.com/TSoIC+Pitch+Day.mp4",
    }
  ];

  const onClickVideoCard = (link, redirectionLink) => {
    if (redirectionLink) window.open(redirectionLink, "_blank");
    else {
      setShowVideoPlayModel(true);
      setCurrentVideo(link);
    }
  };

  const onClickCancel = () => {
    setShowVideoPlayModel(false);
  };

  useEffect(() => {
    let data = videoList.slice(
      (currentVideoPage - 1) * 3,
      (currentVideoPage - 1) * 3 + 3
    );
    setVideoData(data);
    // onClickMediaButton("Videos");
  }, [currentVideoPage]);

  // Article data operations
  const articleRef = useRef(null);
  const [currentArticlePage, setCurrentArticlePage] = useState(1);
  const [articleData, setArticleData] = useState([]);
  const articleList = [
    // {
    //   name: "Unlocking Transport Data: Pioneering Smart City Innovation",
    //   date: "Sep 15 2024",
    //   link: "",
    // },
  ];
  useEffect(() => {
    let data = articleList.slice(
      (currentArticlePage - 1) * 3,
      (currentArticlePage - 1) * 3 + 3
    );
    setArticleData(data);
    // onClickMediaButton("Articles");
  }, [currentArticlePage]);

  // Press release data operations
  const releaseRef = useRef(null);
  const [currentReleasePage, setCurrentReleasePage] = useState(1);
  const [releaseData, setReleaseData] = useState([]);
  const pressReleaseList = [
      {
        name: "JICA's Transport Stack Open Innovation Challenge successfully concluded; 5 winning teams to now launch PoCs in Delhi transport ecosystem",
        date: "Feb 17 2025",
        backgroundImage: release_img2,
        link: "https://www.businesswireindia.com/jicas-transport-stack-open-innovation-challenge-successfully-concluded-5-winning-teams-to-now-launch-pocs-in-delhi-transport-ecosystem-93576.html/",
      },
    {
      name: "Transport Stack Open Innovation Challenge launched in collaboration with JICA and FITT @ IIT Delhi, to drive transformative mobility solutions",
      date: "Sep 15 2024",
      backgroundImage: release_img1,
      link: "https://www.apnnews.com/transport-stack-open-innovation-challenge-launched-in-collaboration-with-jica-and-fitt-iit-delhi-to-drive-transformative-mobility-solutions/",
    },
  ];
  useEffect(() => {
    let data = pressReleaseList.slice(
      (currentReleasePage - 1) * 3,
      (currentReleasePage - 1) * 3 + 3
    );
    setReleaseData(data);
    // onClickMediaButton("Press Release");
  }, [currentReleasePage]);

  const onClickMediaButton = (name) => {
    if (name === "Videos")
      videoRef.current?.scrollIntoView({ behavior: "smooth" });
    else if (name === "Articles")
      articleRef.current?.scrollIntoView({ behavior: "smooth" });
    else if (name === "Press Release")
      releaseRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="media">
      {showVideoPlayModel && (
        <VideoPlayModel onClickCancel={onClickCancel} link={currentVideo} />
      )}

      <AddSeo
        title="Media & PR : Delhi Transport Stack"
        description="Explore the latest news, press releases, and resources from Delhi Transport Stack."
        keywords="Delhi Transport Stack Press Releases, Delhi Transport Stack Media, Delhi Transport Stack News & Coverage, Lates News, Events, Updates"
      />
      <div className="content-header">
        <div className="container">
          <Breadcrumb />
          <div className="d-flex">
            <img
              src={arrow}
              alt="left arrow"
              className="left-arrow"
              onClick={() => navigate(-1)}
            />
            <h1 className="header-title">Media</h1>
          </div>
          <div className="media__btns pt-4">
            <ButtonComponent
              type="primaryWhite"
              onClick={() => onClickMediaButton("Videos")}
            >
              Videos
            </ButtonComponent>
            <ButtonComponent
              type="primaryWhite"
              onClick={() => onClickMediaButton("Articles")}
            >
              Articles
            </ButtonComponent>
            <ButtonComponent
              type="primaryWhite"
              onClick={() => onClickMediaButton("Press Release")}
            >
              Press Release
            </ButtonComponent>
          </div>
        </div>
      </div>
      <div className="content-body">
        <div className="container">
          <div className="videos mb-5" ref={videoRef}>
            <h2 className="videos__title pb-3">Videos</h2>
            {videoList?.length > 0 ? (
              <>
                <div className="row m-0">
                  {videoData.map((item, index) => {
                    return (
                      <div
                        key={index + ""}
                        className="col-md-4 p-0 videos__cards"
                      >
                        <MediaVideoCard
                          data={item}
                          onClick={() =>
                            onClickVideoCard(item.link, item?.redirectionLink)
                          }
                        ></MediaVideoCard>
                      </div>
                    );
                  })}
                </div>
                <Pagination
                  className="mb-0"
                  totalPages={
                    Number.isInteger(videoList.length / 3)
                      ? videoList.length / 3
                      : Math.floor(videoList.length / 3) + 1
                  }
                  currentPage={currentVideoPage}
                  setCurrentPage={setCurrentVideoPage}
                />
              </>
            ) : (
              <p>Coming Soon</p>
            )}
          </div>

          <div className="articles mb-5" ref={articleRef}>
            <h2 className="articles__title pb-3">Articles</h2>
            {articleList?.length > 0 ? (
              <>
                <div className="row m-0">
                  {articleData.map((item, index) => {
                    return (
                      <div
                        key={index + ""}
                        className="col-md-4 p-0 articles__cards"
                      >
                        <MediaArticleCard data={item}></MediaArticleCard>
                      </div>
                    );
                  })}
                </div>
                <Pagination
                  className="mb-0"
                  totalPages={
                    Number.isInteger(articleList.length / 3)
                      ? articleList.length / 3
                      : Math.floor(articleList.length / 3) + 1
                  }
                  currentPage={currentArticlePage}
                  setCurrentPage={setCurrentArticlePage}
                />
              </>
            ) : (
              <p>Coming Soon</p>
            )}
          </div>

          <div className="release mb-5" ref={releaseRef}>
            <h2 className="release__title pb-3">Press Release</h2>
            {pressReleaseList?.length > 0 ? (
              <>
                <div className="row m-0">
                  {releaseData.map((item, index) => {
                    return (
                      <div
                        key={index + ""}
                        className="col-md-4 p-0 release__cards"
                      >
                        <MediaReleaseCard data={item}></MediaReleaseCard>
                      </div>
                    );
                  })}
                </div>
                <Pagination
                  className="mb-0"
                  totalPages={
                    Number.isInteger(pressReleaseList.length / 3)
                      ? pressReleaseList.length / 3
                      : Math.floor(pressReleaseList.length / 3) + 1
                  }
                  currentPage={currentReleasePage}
                  setCurrentPage={setCurrentReleasePage}
                />
              </>
            ) : (
              <p>Coming Soon</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Media;

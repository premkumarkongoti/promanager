import React, { useEffect, useState } from "react";
import styles from "./Analytics.module.css";
import { getAnalyticsData } from "../../apis/task";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

function DataOverview() {
  const [analyticData, setAnalyticData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await getAnalyticsData();
      if (response?.success === false) {
        toast.error(response?.message);
      } else if (response?.success === true) {
        setAnalyticData(response.data);
      }
    } catch (error) {
      toast.error("Server is not responding");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.dataOverview}>
      <p className={styles.header}>Analytics</p>
      {isLoading && <LoadingSpinner />}
      {!isLoading && analyticData ? (
        <div className={styles.dataCards}>
          <div className={styles.dataCard}>
            <div className={styles.cardItem}>
              <div className={styles.cardElement}>
                <div className={styles.statusDot}></div>
                <p>Backlog Tasks</p>
              </div>
              <div className={styles.count}>{analyticData.backlogCount}</div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.cardElement}>
                <div className={styles.statusDot}></div>
                <p>To-do Tasks</p>
              </div>
              <div className={styles.count}>{analyticData.todoCount}</div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.cardElement}>
                <div className={styles.statusDot}></div>
                <p>In-Progress Tasks</p>
              </div>
              <div className={styles.count}>{analyticData.progressCount}</div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.cardElement}>
                <div className={styles.statusDot}></div>
                <p>Completed Tasks</p>
              </div>
              <div className={styles.count}>{analyticData.completedCount}</div>
            </div>
          </div>
          <div className={styles.dataCard}>
            <div className={styles.cardItem}>
              <div className={styles.cardElement}>
                <div className={styles.statusDot}></div>
                <p>Low Priority</p>
              </div>
              <div className={styles.count}>{analyticData.lowCount}</div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.cardElement}>
                <div className={styles.statusDot}></div>
                <p>Moderate Priority</p>
              </div>
              <div className={styles.count}>{analyticData.moderateCount}</div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.cardElement}>
                <div className={styles.statusDot}></div>
                <p>High Priority</p>
              </div>
              <div className={styles.count}>{analyticData.highCount}</div>
            </div>
            <div className={styles.cardItem}>
              <div className={styles.cardElement}>
                <div className={styles.statusDot}></div>
                <p>Due Date Tasks</p>
              </div>
              <div className={styles.count}>{analyticData.dueDateNotDoneCount}</div>
            </div>
          </div>
        </div>
      ) : !isLoading ? (
        <p className={styles.errorText}>
          Error Code 503: Service Unavailable
        </p>
      ) : (
        <></>
      )}

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              fontSize: "1.5rem",
              height: "3rem",
            },
          },
          error: {
            style: {
              fontSize: "1.5rem",
              height: "3rem",
            },
          },
        }}
      />
    </div>
  );
}

export default DataOverview;

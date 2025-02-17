'use client'
import { useEffect, useState } from 'react';
import styles from './NFTSetupProgress.module.css';

interface NFTSetupProgressProps {
    eventId: number;
}

export default function NFTSetupProgress({ eventId }: NFTSetupProgressProps) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<string>('設定中...');
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkNFTSetup = async () => {
            try {
                const response = await fetch(`/api/event/${eventId}/nft-status`);
                const data = await response.json();

                const { isCreatorSet, isMetadataSet } = data.data;

                if (isCreatorSet && isMetadataSet) {
                    setProgress(100);
                    setStatus('NFTの設定が完了しました！');
                    setIsComplete(true);
                    return true;
                } else if (isCreatorSet) {
                    setProgress(50);
                    setStatus('NFTメタデータを設定中...');
                } else {
                    setProgress(25);
                    setStatus('イベント作成者を設定中...');
                }

                return false;

            } catch (error) {
                setError('NFTの設定に失敗しました。このイベントは削除されます。');
                return true;
            }
        };

        if (!isComplete && !error) {
            const intervalId = setInterval(async () => {
                const isDone = await checkNFTSetup();
                if (isDone) {
                    clearInterval(intervalId);
                }
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, [eventId, isComplete, error]);

    if (error) {
        return (
            <div className={styles.error}>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>NFTの設定状況</h3>
            <div className={styles.progressContainer}>
                <div 
                    className={styles.progressBar} 
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className={styles.status}>{status}</p>
            {isComplete && (
                <p className={styles.complete}>
                    ✅ NFTの設定が完了しました
                </p>
            )}
        </div>
    );
}

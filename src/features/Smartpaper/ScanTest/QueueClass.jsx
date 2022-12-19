import { getScanResult } from '../../../api/api';

export class ImageQueue {
  static SUCCESS = 'success';
  static FAILURE = 'failure';
  static COMPLETE = 'complete';

  images = [];
  userName;
  testName;
  orgName;
  school;
  grade;
  rollNo;
  subject;
  requestArray;

  processedRequests = 0;
  totalRequests = undefined;
  scanRequests = [];
  constructor(
    requestArray,
    school,
    grade,
    rollNo,
    subject,
    successCallback,
    failureCallback
  ) {
    this.requestArray = requestArray;

    this.school = school;
    this.grade = grade;
    this.rollNo = rollNo;
    this.subject = subject;
    this.successFn = successCallback;
    this.failureFn = failureCallback;
  }

  start() {
    // console.log('req array', this.requestArray);
    this.totalRequests = this.requestArray.length;
    this.addToQueue(this.requestArray);
  }

  addToQueue = () => {
    this.requestArray.forEach((req) => {
      this.scanRequests.push(
        getScanResult({
          targetName: req.targetName,
          targetImages: [req.targetImages],
          // orgName: req.orgName,
          requestId: req.requestId,
          userName: req.userName,
          fileName: req.fileName,
          receivedAt: req.receivedAt,
          saveCrops: req.saveCrops,
          metadata: req.metadata,
          doQualityCheck: req.doQualityCheck,
          groupId: req.groupId,
          organizationId: req.organizationId,
          school: this.school,
          grade: this.grade,
          rollNo: this.rollNo,
          subject: this.subject,
        })
      );
    });
    this.processParallel(this.scanRequests);
  };

  async processParallel(scanRequests) {
    // const start = performance.now();
    scanRequests.forEach(async (request) => {
      await request
        .then((response) => {
          // console.log(`Response - ${id}`, response);
          this.processedRequests++;
          this.successFn(response, this.processedRequests);
        })
        .catch((error) => {
          this.processedRequests++;
          this.failureFn(error, this.processedRequests);
        });
    });

    // const end = performance.now();
    // console.log(`Time taken ${end - start}`);
  }
}

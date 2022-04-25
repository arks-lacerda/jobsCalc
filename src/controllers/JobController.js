const Job = require('../model/Job');
const JobUtils = require('../utils/JobUtils');
const Profile = require('../model/Profile');

module.exports = {
    create(req, res) {
        return res.render("job");
    },

    async save(req, res) {
        //job.createAt = Date.now(); // atribuindo uma nova data

        await Job.create({
            name: req.body.name,
            "daily-hours": req.body["daily-hours"],
            "total-hours": req.body["total-hours"],
            createAt: Date.now() 
        });

        return res.redirect('/');
    },

    async show(req, res) {
        const jobs = await Job.get();
        const jodId = req.params.id;

        const job = jobs.find(job => Number(job.id) === Number(jodId));

        if (!job) {
            return res.send('Job not found!');
        };

        const profile = await Profile.get();

        job.budget = JobUtils.calculateBubget(job, profile["value-hour"]);

        return res.render("job-edit", { job });
    },

    async update(req,res) {
        const jobId = req.params.id;
        
        const updatedJob = {
            name: req.body.name,
            "total-hours": req.body["total-hours"],
            "daily-hours": req.body["daily-hours"],
        };

        Job.update(updatedJob, jobId);

        res.redirect('/job/' + jobId);
    },

    async delete(req, res) {
        const jobId = req.params.id;

        await Job.delete(jobId);

        return res.redirect('/');
    }
};
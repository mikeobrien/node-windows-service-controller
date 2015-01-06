using System;

namespace Service
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var serviceManager = ServiceManager.Create();
            var name = args.Length > 0 ? args[0] : "Service";

            serviceManager.AddService(s =>
            {
                s.Named(name);
                s.HowToBuildService(x => new TimerController());
                s.WhenStarted<TimerController>(controller => controller.Start());
                s.WhenStopped<TimerController>(controller => controller.Stop());
            });

            serviceManager.RunServices();
        }
    }

    public class TimerController
    {
        private readonly ServiceTimer _timer;

        public TimerController()
        {
            _timer = new ServiceTimer(1000,
                               ServiceTimer.TimerElapseStartMode.Immediate,
                               ServiceTimer.TimerElapseReentranceMode.NonReentrant);
            _timer.Elapsed += ProcessTimerElapsed;
        }

        private void ProcessTimerElapsed(object sender, ServiceTimer.ElapsedEventArgs e)
        {
            Console.WriteLine("Elapsed...");
        }

        public void Start()
        {
            Console.WriteLine("Start...");
        }

        public void Stop()
        {
            Console.WriteLine("Stop...");
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class TestItem
    {
        public TestItem(string id)
        {
            Id = id;
        }

        public string Id { get; set; }
        public string Name { get; set; }
    }
}
